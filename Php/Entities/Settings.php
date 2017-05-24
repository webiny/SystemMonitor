<?php
namespace Apps\SystemMonitor\Php\Entities;

/**
 * Class Settings
 *
 * @package Apps\Webiny\Php\Entities
 */
class Settings extends \Apps\Webiny\Php\Entities\Settings
{
    protected static $key = 'system-monitor';

    public function save()
    {
        /**
         * @see http://php.net/manual/en/mongodb.setprofilinglevel.php
         */
        if (!$this->settings->keyNested('dbMonitor.status', false, true)) {
            $this->wDatabase()->command(['profile' => 0]);
        } else {
            $this->wDatabase()->command(['profile' => 1, 'slowms' => intval($this->settings->keyNested('dbMonitor.slowQueryThreshold'))]);
        }

        return parent::save();
    }
}