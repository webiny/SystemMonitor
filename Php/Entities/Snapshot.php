<?php

namespace Apps\SystemMonitor\Php\Entities;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class SystemSnapshot
 *
 * @property string $id
 * @property array  $stats
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class Snapshot extends AbstractEntity
{
    protected static $entityCollection = 'SystemMonitorSnapshots';

    public function __construct()
    {
        parent::__construct();
        $this->attributes->remove('deletedOn', 'deletedBy', 'modifiedOn', 'modifiedBy');
        $this->attr('server')->many2one()->setEntity('Apps\SystemMonitor\Php\Entities\Server');
        $this->attr('time')->object()->onGet(function ($value) {
            if (is_string($this->createdOn) && $this->createdOn !== 'now') {
                $time = $this->datetime($this->createdOn);
                $value = [
                    'm' => intval($time->getMonth()),
                    'd' => intval($time->getDay()),
                    'H' => intval($time->getHours()),
                    'i' => intval($time->getMinutes())
                ];
                $this->time = $value;
            }

            return $value;
        });
        $this->attr('stats')->object()->setToArrayDefault();
    }

    protected function entityApi(ApiContainer $api)
    {
        parent::entityApi($api);

        // We must allow CRUD CREATE requests for agent scripts
        // TODO: see if this has to be public or maybe include system token in agent scripts?
        $api->post('/')->setPublic();
    }


    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        // delete records after 2 months
        $indexes->add(new SingleIndex('createdOn', 'createdOn', null, false, false, 5184000));
        $indexes->add(new SingleIndex('server', 'server'));
    }
}