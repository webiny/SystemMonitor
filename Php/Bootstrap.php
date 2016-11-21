<?php
namespace Apps\SystemMonitor\Php;

use Apps\Core\Php\DevTools\AbstractBootstrap;
use Apps\Core\Php\PackageManager\App;
use Apps\SystemMonitor\Php\Entities\Settings;

class Bootstrap extends AbstractBootstrap
{
    public function run(App $app)
    {
        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        $settings = Settings::load();
        if (!$settings) {
            return false;
        }

        if (!$settings->keyNested('dbMonitor.status', false, true)) {
            $this->wDatabase()->command(['profile' => 0]);
        } else {
            $this->wDatabase()->command(['profile' => 1, 'slowms' => intval($settings->keyNested('dbMonitor.slowQueryThreshold'))]);
        }
    }
}