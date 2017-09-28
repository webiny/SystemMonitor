import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

/**
 * @i18n.namespace SystemMonitor.Backend.DbMonitor
 */
class ApiMonitor extends Webiny.App.Module {

    init() {
        this.name = 'DbMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label={Webiny.I18n('System')} icon="icon-tools">
                <Menu label={Webiny.I18n('System Monitor')}>
                    <Menu label={Webiny.I18n('DB Monitor')} route="SystemMonitor.DbMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.DbMonitor.Dashboard', '/system-monitor/db-monitor', Dashboard, 'DB Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;