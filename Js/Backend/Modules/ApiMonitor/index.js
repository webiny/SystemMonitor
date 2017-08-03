import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

class ApiMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ApiMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="System Monitor">
                    <Menu label="API Monitor" route="SystemMonitor.ApiMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ApiMonitor.Dashboard', '/system-monitor/api-monitor', Dashboard, 'API Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;