import Webiny from 'Webiny';
import Dashboard from './Dashboard';

class ResourceMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ResourceMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('Resource Monitor', 'SystemMonitor.ResourceMonitor.Dashboard')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ResourceMonitor.Dashboard', '/system-monitor/resource-monitor', Dashboard, 'Resource Monitor - Dashboard')
        );
    }
}

export default ResourceMonitor;