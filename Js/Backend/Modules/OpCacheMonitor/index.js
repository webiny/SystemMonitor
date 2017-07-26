import Webiny from 'webiny';
import Dashboard from './Dashboard';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'OpCacheMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('OpCache Monitor', 'SystemMonitor.OpCacheMonitor.Dashboard')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.OpCacheMonitor.Dashboard', '/system-monitor/opcache-monitor', Dashboard, 'OpCache Monitor - Dashboard')
        );
    }
}

export default Module;