<?php
namespace Apps\SystemMonitor\Php;

use Apps\Core\Php\DevTools\AbstractBootstrap;
use Apps\Core\Php\PackageManager\App;
use Apps\SystemMonitor\Php\Entities\Setting;

class Bootstrap extends AbstractBootstrap
{
    public function run(App $app)
    {
        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        $settings = Setting::load('system-monitor');
        if (!$settings) {
            return false;
        }

        $settings = $settings->settings->dbMonitor;
        if (!$settings['status']) {
            $this->wDatabase()->command(['profile' => 0]);
        } else {
            $this->wDatabase()->command(['profile' => 1, 'slowms' => intval($settings['slowQueryThreshold'])]);
        }
    }
}