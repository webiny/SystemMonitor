import React from 'react';
import Webiny from 'webiny';
import Dashboard from './Dashboard';

/**
 * @i18n.namespace SystemMonitor.Backend.ApiMonitor
 */
class ApiMonitor extends Webiny.App.Module {

    init() {
        this.name = 'ApiMonitor';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label={Webiny.I18n('System')} icon="icon-tools">
                <Menu label={Webiny.I18n('System Monitor')}>
                    <Menu label={Webiny.I18n('API Monitor')} route="SystemMonitor.ApiMonitor.Dashboard"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.ApiMonitor.Dashboard', '/system-monitor/api-monitor', Dashboard, 'API Monitor - Dashboard')
        );
    }
}

export default ApiMonitor;