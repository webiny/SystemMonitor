import Webiny from 'Webiny';
import Dashboard from './Dashboard';

class ApiMonitor extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('Api Monitor', 'SystemMonitor.ApiMonitor.Dashboard')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ApiMonitor.Dashboard', '/system-monitor/api-monitor', Dashboard, 'Api Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;