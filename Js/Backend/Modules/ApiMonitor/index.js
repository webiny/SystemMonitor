import Webiny from 'webiny';
import Dashboard from './Dashboard';

class ApiMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ApiMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('API Monitor', 'SystemMonitor.ApiMonitor.Dashboard')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ApiMonitor.Dashboard', '/system-monitor/api-monitor', Dashboard, 'API Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;