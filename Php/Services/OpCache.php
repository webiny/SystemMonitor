<?php
namespace Apps\SystemMonitor\Php\Services;

use Apps\Webiny\Php\DevTools\Services\AbstractService;

/**
 * Class OpCache
 *
 * @package Apps\SystemMonitor\Php\Services
 *
 */
class OpCache extends AbstractService
{
    public function __construct()
    {
        $this->api('GET', '/', function () {
            if (!function_exists('opcache_get_status')) {
                return false;
            }

            $status = opcache_get_status();
            if ($status) {
                $status['configuration'] = opcache_get_configuration();
            }

            return $status;
        })->setPublic();

        $this->api('POST', '/flush-all', function () {
            if (!function_exists('opcache_reset')) {
                return false;
            }

            return opcache_reset();
        })->setPublic();

        $this->api('POST', '/flush', function () {
            if (!function_exists('opcache_invalidate')) {
                return false;
            }

            $script = $this->wRequest()->getRequestData()['script'];

            return opcache_invalidate($script, true);
        })->setBodyValidators(['script' => 'required'])->setPublic();
    }
}
