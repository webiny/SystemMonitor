<?php

namespace Apps\SystemMonitor\Php;

class Install extends \Apps\Webiny\Php\Lib\LifeCycle\Install
{
    public function getUserPermissions()
    {
        return json_decode(file_get_contents(__DIR__ . '/Install/UserPermissions.json'), true);
    }

    public function getUserRoles()
    {
        return json_decode(file_get_contents(__DIR__ . '/Install/UserRoles.json'), true);
    }
}