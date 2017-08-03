import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'OpCacheMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="System Monitor">
                    <Menu label="OpCache Monitor" route="SystemMonitor.OpCacheMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.OpCacheMonitor.Dashboard', '/system-monitor/opcache-monitor', Dashboard, 'OpCache Monitor - Dashboard')
        );
    }
}

export default Module;