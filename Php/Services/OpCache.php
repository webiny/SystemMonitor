<?php

namespace Apps\SystemMonitor\Php\Services;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Services\AbstractService;

/**
 * Class OpCache
 */
class OpCache extends AbstractService
{
    protected static $classId = 'SystemMonitor.Services.OpCache';

    protected function serviceApi(ApiContainer $api)
    {
        $api->get('/', function () {
            if (!function_exists('opcache_get_status')) {
                return false;
            }

            $status = opcache_get_status();
            if ($status) {
                $status['configuration'] = opcache_get_configuration();
            }

            return $status;
        })->setPublic();

        $api->post('/flush-all', function () {
            if (!function_exists('opcache_reset')) {
                return false;
            }

            return opcache_reset();
        })->setPublic();

        $api->post('/flush', function () {
            if (!function_exists('opcache_invalidate')) {
                return false;
            }

            $script = $this->wRequest()->getRequestData()['script'];

            return opcache_invalidate($script, true);
        })->setBodyValidators(['script' => 'required'])->setPublic();
    }
}
