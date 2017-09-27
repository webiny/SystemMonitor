import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

/**
 * @i18n.namespace SystemMonitor.Backend.ResourceMonitor
 */
class ResourceMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ResourceMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label={Webiny.I18n('System')} icon="icon-tools">
                <Menu label={Webiny.I18n('System Monitor')}>
                    <Menu label={Webiny.I18n('Resource Monitor')} route="SystemMonitor.ResourceMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ResourceMonitor.Dashboard', '/system-monitor/resource-monitor', Dashboard, 'Resource Monitor - Dashboard')
        );
    }
}

export default ResourceMonitor;