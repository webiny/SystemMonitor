import Webiny from 'Webiny';
import SettingsForm from './SettingsForm';

class Settings extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('System Monitor', [
                    new Menu('Settings', 'SystemMonitor.Settings')
                ])
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.Settings', '/system-monitor/settings', SettingsForm, 'System Monitor - Settings')
        );
    }
}

export default Settings;