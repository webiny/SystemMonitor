import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

class ResourceMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ResourceMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="System Monitor">
                    <Menu label="Resource Monitor" route="SystemMonitor.ResourceMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ResourceMonitor.Dashboard', '/system-monitor/resource-monitor', Dashboard, 'Resource Monitor - Dashboard')
        );
    }
}

export default ResourceMonitor;