using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
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

    protected override void OnClosed(EventArgs e)
    {
        try { _aiCts?.Cancel(); _aiTcp?.Stop(); } catch { /* 忽略 */ }
        base.OnClosed(e);
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
        StartAiHttp();
    }

    /* ================= AI 本机服务（仅绑定 127.0.0.1，供 AI 工具直接操作画布） =================
     * GET  /api/ping      探活
     * GET  /api/context   当前设计上下文（喂给 AI）
     * GET  /api/protocol  完整协议文档
     * POST /api/op        应用协议操作（body 为协议 JSON 或其数组）
     * 页面尚未就绪时请求返回错误；用 TcpListener 手写最小 HTTP，避免 HttpListener 的 URLACL 限制。 */

    private TcpListener _aiTcp;
    private CancellationTokenSource _aiCts;
    private int _aiPort;

    private void StartAiHttp()
    {
        _aiCts = new CancellationTokenSource();
        Task.Run(async () =>
        {
            for (int port = 41289; port < 41299; port++)
            {
                try
                {
                    var l = new TcpListener(IPAddress.Loopback, port);
                    l.Start();
                    _aiTcp = l;
                    _aiPort = port;
                    break;
                }
                catch { /* 端口被占用，试下一个 */ }
            }
            if (_aiTcp == null) return;

            /* 把实际端口告知页面（页面未就绪则短暂重试），面板会显示真实地址 */
            for (int i = 0; i < 10; i++)
            {
                var ping = await EvalJsAsync("window.__gwAI ? (window.__gwAI.port=" + _aiPort +
                    ", document.getElementById('aiLocalUrl') ? (document.getElementById('aiLocalUrl').textContent='http://127.0.0.1:" + _aiPort + "', 'ok') : 'ok') : 'no'");
                if (ping == "ok") break;
                await Task.Delay(700);
            }

            try
            {
                while (!_aiCts.IsCancellationRequested)
                {
                    var client = await _aiTcp.AcceptTcpClientAsync(_aiCts.Token);
                    _ = Task.Run(() => ServeAiClient(client));
                }
            }
            catch (OperationCanceledException) { /* 正常关闭 */ }
            catch { /* 监听异常退出 */ }
        });
    }

    /// <summary>在 UI 线程执行 JS 并取回其字符串结果（脚本应返回 string；页面未就绪返回 null）。</summary>
    private async Task<string> EvalJsAsync(string expression)
    {
        var tcs = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);
        await Dispatcher.InvokeAsync(async () =>
        {
            try
            {
                var raw = await Web.CoreWebView2.ExecuteScriptAsync(expression);
                try { tcs.SetResult(JsonSerializer.Deserialize<string>(raw)); }
                catch { tcs.SetResult(null); }
            }
            catch (Exception ex) { tcs.SetException(ex); }
        });
        return await tcs.Task;
    }

    private async Task ServeAiClient(TcpClient client)
    {
        try
        {
            using (client)
            {
                client.ReceiveTimeout = 5000;
                client.SendTimeout = 5000;
                var stream = client.GetStream();
                var reqLine = await ReadLineAsync(stream);
                if (string.IsNullOrWhiteSpace(reqLine)) return;
                var parts = reqLine.Split(' ');
                if (parts.Length < 2) return;
                var method = parts[0].ToUpperInvariant();
                var path = parts[1];
                int q = path.IndexOf('?');
                if (q >= 0) path = path.Substring(0, q);

                int contentLength = 0;
                while (true)
                {
                    var h = await ReadLineAsync(stream);
                    if (h.Length == 0) break;
                    if (h.StartsWith("Content-Length:", StringComparison.OrdinalIgnoreCase))
                        int.TryParse(h.Substring(15).Trim(), out contentLength);
                }
                var body = "";
                if (contentLength > 0 && contentLength < 5_000_000)
                {
                    var buf = new byte[contentLength];
                    int off = 0;
                    while (off < contentLength)
                    {
                        int n = await stream.ReadAsync(buf, off, contentLength - off);
                        if (n <= 0) break;
                        off += n;
                    }
                    body = Encoding.UTF8.GetString(buf, 0, off);
                }

                string resp;
                string route = method + " " + path;
                if (route == "GET /api/ping" || route == "OPTIONS /api/op")
                {
                    resp = "{\"ok\":true,\"app\":\"gw-designer\",\"protocol\":\"v1\",\"endpoints\":[\"GET /api/ping\",\"GET /api/context\",\"GET /api/protocol\",\"POST /api/op\"]}";
                }
                else if (route == "GET /api/context")
                {
                    resp = await EvalJsAsync("window.__gwAI ? window.__gwAI.contextJson() : null")
                        ?? "{\"ok\":false,\"error\":\"设计器页面尚未就绪\"}";
                }
                else if (route == "GET /api/protocol")
                {
                    var doc = await EvalJsAsync("window.M3E_AI ? window.M3E_AI.schemaDoc() : null");
                    resp = doc == null
                        ? "{\"ok\":false,\"error\":\"设计器页面尚未就绪\"}"
                        : "{\"ok\":true,\"protocol\":" + JsonSerializer.Serialize(doc) + "}";
                }
                else if (route == "POST /api/op")
                {
                    var script = "window.__gwAI.handleOpFromJson(" + JsonSerializer.Serialize(body ?? "") + ")";
                    resp = await EvalJsAsync(script)
                        ?? "{\"ok\":false,\"error\":\"设计器页面尚未就绪\"}";
                }
                else
                {
                    resp = "{\"ok\":false,\"error\":\"未知端点。可用：GET /api/ping · GET /api/context · GET /api/protocol · POST /api/op（body 为协议 JSON 或其数组）\"}";
                }
                await WriteRespAsync(stream, resp);
            }
        }
        catch { /* 单个连接失败不影响服务 */ }
    }

    private static async Task<string> ReadLineAsync(NetworkStream stream)
    {
        var sb = new StringBuilder();
        var buf = new byte[1];
        while (sb.Length < 8192)
        {
            int n = await stream.ReadAsync(buf, 0, 1);
            if (n <= 0) break;
            char c = (char)buf[0];
            if (c == '\n') break;
            if (c != '\r') sb.Append(c);
        }
        return sb.ToString();
    }

    private static async Task WriteRespAsync(NetworkStream stream, string jsonBody)
    {
        var body = Encoding.UTF8.GetBytes(jsonBody ?? "");
        var head = Encoding.UTF8.GetBytes(
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; charset=utf-8\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Access-Control-Allow-Headers: content-type\r\n" +
            "Connection: close\r\n" +
            "Content-Length: " + body.Length + "\r\n\r\n");
        await stream.WriteAsync(head, 0, head.Length);
        await stream.WriteAsync(body, 0, body.Length);
        await stream.FlushAsync();
    }
}
