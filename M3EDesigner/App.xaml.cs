using System.Windows;
using System.Windows.Threading;

namespace M3EDesigner;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        DispatcherUnhandledException += (s, args) =>
        {
            MessageBox.Show(args.Exception.Message, "gw Designer 错误",
                MessageBoxButton.OK, MessageBoxImage.Error);
            args.Handled = true;
        };
    }
}
