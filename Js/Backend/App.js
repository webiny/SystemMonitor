import Webiny from 'Webiny';
import ApiMonitor from './Modules/ApiMonitor';
import DbMonitor from './Modules/DbMonitor';
import OpCacheMonitor from './Modules/OpCacheMonitor';
import ResourceMonitor from './Modules/ResourceMonitor';
import Settings from './Modules/Settings';

class SystemMonitor extends Webiny.App {
    constructor() {
        super('SystemMonitor.Backend');
        this.modules = [
            new ApiMonitor(this),
            new DbMonitor(this),
            new OpCacheMonitor(this),
            new ResourceMonitor(this),
            new Settings(this)
        ];
    }
}

Webiny.registerApp(new SystemMonitor());