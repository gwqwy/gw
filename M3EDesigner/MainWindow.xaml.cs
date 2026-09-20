using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Windows;
using Microsoft.Web.WebView2.Core;

namespace M3EDesigner;

/// <summary>JS ↔ 桌面桥：文件对话框 / 剪贴板 / 批量导出 / 浏览器预览 / 标题。</summary>
[ComVisible(true)]
[System.Runtime.InteropServices.ClassInterface(System.Runtime.InteropServices.ClassInterfaceType.AutoDual)]
public class Bridge
{
    private readonly Window _owner;

    public Bridge(Window owner) { _owner = owner; }

    /* ---------- 剪贴板 ---------- */
    public void CopyText(string text)
    {
        try { Clipboard.SetText(text ?? ""); } catch { /* 剪贴板被占用时忽略 */ }
    }

    public string GetClipboardText()
    {
        try { return Clipboard.ContainsText() ? Clipboard.GetText() : ""; }
        catch { return ""; }
    }

    /* ---------- 文件对话框 ---------- */
    public bool SaveTextFile(string defaultName, string filter, string content)
    {
        var dlg = new Microsoft.Win32.SaveFileDialog
        {
            Title = "保存文件",
            FileName = defaultName ?? "未命名",
            Filter = string.IsNullOrWhiteSpace(filter) ? "所有文件|*.*" : filter,
            AddExtension = true,
        };
        if (dlg.ShowDialog(_owner) != true) return false;
        File.WriteAllText(dlg.FileName, content ?? "");
        return true;
    }

    public string OpenTextFile(string filter)
    {
        var dlg = new Microsoft.Win32.OpenFileDialog
        {
            Title = "打开文件",
            Filter = string.IsNullOrWhiteSpace(filter) ? "所有文件|*.*" : filter,
        };
        if (dlg.ShowDialog(_owner) != true) return null;
        return File.ReadAllText(dlg.FileName);
    }

    public string PickFolder(string title)
    {
        var dlg = new Microsoft.Win32.OpenFileDialog
        {
            Title = string.IsNullOrWhiteSpace(title) ? "选择文件夹" : title,
            ValidateNames = false,
            CheckFileExists = false,
            CheckPathExists = true,
            FileName = "选择此文件夹",
        };
        if (dlg.ShowDialog(_owner) != true) return "";
        return Path.GetDirectoryName(dlg.FileName);
    }

    /// <summary>批量写文件。filesJson: [{"name":"a.html","content":"..."},...]</summary>
    public int WriteFiles(string folder, string filesJson)
    {
        try
        {
            var files = JsonSerializer.Deserialize<List<JsonElement>>(filesJson ?? "[]");
            int n = 0;
            foreach (var f in files)
            {
                var name = f.GetProperty("name").GetString();
                var content = f.GetProperty("content").GetString() ?? "";
                if (string.IsNullOrWhiteSpace(name)) continue;
                var safe = string.Join("_", name.Split(Path.GetInvalidFileNameChars()));
                File.WriteAllText(Path.Combine(folder, safe), content);
                n++;
            }
            return n;
        }
        catch { return -1; }
    }

    /* ---------- 组件库持久化（自定义组件长期保存，独立于 WebView2 缓存） ---------- */
    private static string LibPath => Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "M3EDesigner", "library.json");

    public string ReadLib()
    {
        try { return File.Exists(LibPath) ? File.ReadAllText(LibPath) : ""; }
        catch { return ""; }
    }

    public bool WriteLib(string json)
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(LibPath)!);
            File.WriteAllText(LibPath, json ?? "");
            return true;
        }
        catch { return false; }
    }

    /* ---------- 预览 ---------- */
    public void PreviewInBrowser(string html)
    {
        var dir = Path.Combine(Path.GetTempPath(), "M3EDesignerPreview");
        Directory.CreateDirectory(dir);
        var path = Path.Combine(dir, $"preview_{DateTime.Now:yyyyMMdd_HHmmss}.html");
        File.WriteAllText(path, html ?? "");
        Process.Start(new ProcessStartInfo(path) { UseShellExecute = true });
    }

    /* ---------- 标题 ---------- */
    public void SetTitle(string title)
    {
        _owner.Dispatcher.BeginInvoke(() => _owner.Title = title);
    }
}

public partial class MainWindow : Window
{
    private Bridge _bridge;

    public MainWindow()
    {
        InitializeComponent();
        Loaded += async (_, _) => await InitWeb();
    }

    /// <summary>高 DPI / 小屏幕下窗口可能比工作区还高，居中后标题栏会跑到屏幕外；
    /// 启动时把尺寸与位置钳制在屏幕工作区内。</summary>
    protected override void OnSourceInitialized(EventArgs e)
    {
        base.OnSourceInitialized(e);
        var wa = SystemParameters.WorkArea;
        Width = Math.Min(Width, wa.Width);
        Height = Math.Min(Height, wa.Height);
        Left = wa.Left + Math.Max(0, (wa.Width - Width) / 2);
        Top = wa.Top + Math.Max(0, (wa.Height - Height) / 2);
    }

    private async Task InitWeb()
    {
        var dataDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "M3EDesigner", "WebView2");
        Directory.CreateDirectory(dataDir);

        var env = await CoreWebView2Environment.CreateAsync(
            null, dataDir,
            new CoreWebView2EnvironmentOptions { Language = "zh-CN" });
        await Web.EnsureCoreWebView2Async(env);

        var www = Path.Combine(AppContext.BaseDirectory, "www");
        if (!Directory.Exists(www))
        {
            MessageBox.Show($"找不到设计器资源目录：\n{www}", "gw Designer",
                MessageBoxButton.OK, MessageBoxImage.Error);
            return;
        }

        Web.CoreWebView2.SetVirtualHostNameToFolderMapping(
            "m3edesigner.local", www, CoreWebView2HostResourceAccessKind.Allow);

        _bridge = new Bridge(this);
        Web.CoreWebView2.AddHostObjectToScript("bridge", _bridge);

        Web.CoreWebView2.NewWindowRequested += (s, e) =>
        {
            e.Handled = true;
            // 只放行 http/https 外链：Uri 来自网页内容，不能用 file:/自定协议处理器打开
            if (Uri.TryCreate(e.Uri, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
                Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true });
        };

        Web.CoreWebView2.NavigationStarting += (s, e) =>
        {
            // 只允许虚拟主机，防止网页内意外导航
            if (!e.Uri.StartsWith("https://m3edesigner.local", StringComparison.OrdinalIgnoreCase)
                && !e.Uri.StartsWith("data:"))
                e.Cancel = true;
        };

        Web.CoreWebView2.Navigate("https://m3edesigner.local/index.html");
    }
}
