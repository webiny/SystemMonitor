import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

class ApiMonitor extends Webiny.App.Module {

    init() {
        this.name = 'DbMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="System Monitor">
                    <Menu label="DB Monitor" route="SystemMonitor.DbMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.DbMonitor.Dashboard', '/system-monitor/db-monitor', Dashboard, 'DB Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;