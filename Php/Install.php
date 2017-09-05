<?php

namespace Apps\SystemMonitor\Php;

use Apps\Webiny\Php\AppManager\App;

class Install extends \Apps\Webiny\Php\DevTools\LifeCycle\Install
{
    public function run(App $app)
    {
        parent::run($app);
        // Insert permissions
        $permissions = json_decode(file_get_contents(__DIR__ . '/Install/UserPermissions.json'), true);
        $this->createUserPermissions($permissions);

        // Insert roles
        $roles = json_decode(file_get_contents(__DIR__ . '/Install/UserRoles.json'), true);
        $this->createUserRoles($roles);
    }
}