import React from 'react';
import Webiny from 'webiny';
import SettingsForm from './SettingsForm';

class Settings extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="System Monitor">
                    <Menu label="Settings" route="SystemMonitor.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.Settings', '/system-monitor/settings', SettingsForm, 'System Monitor - Settings')
        );
    }
}

export default Settings;