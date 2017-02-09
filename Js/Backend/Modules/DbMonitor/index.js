import Webiny from 'Webiny';
import Dashboard from './Dashboard';

class ApiMonitor extends Webiny.Module {

    init() {
        this.name = 'DbMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('DB Monitor', 'SystemMonitor.DbMonitor.Dashboard')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.DbMonitor.Dashboard', '/system-monitor/db-monitor', Dashboard, 'DB Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;