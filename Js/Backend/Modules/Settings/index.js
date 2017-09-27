import React from 'react';
import Webiny from 'webiny';
import SettingsForm from './SettingsForm';

/**
 * @i18n.namespace SystemMonitor.Backend.Settings
 */
class Settings extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label={Webiny.I18n('System')} icon="icon-tools">
                <Menu label={Webiny.I18n('System Monitor')}>
                    <Menu label={Webiny.I18n('Settings')} route="SystemMonitor.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.Settings', '/system-monitor/settings', SettingsForm, 'System Monitor - Settings')
        );
    }
}

export default Settings;