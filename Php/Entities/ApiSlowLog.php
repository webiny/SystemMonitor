<?php

namespace Apps\SystemMonitor\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\Mongo\Index\TextIndex;

/**
 * Class ApiSlowLog
 *
 * @property string  $id
 * @property string  method
 * @property string  url
 * @property string  referer
 * @property float   responseTime
 * @property integer count
 */
class ApiSlowLog extends AbstractEntity
{
    protected static $classId = 'SystemMonitor.Entities.ApiSlowLog';
    protected static $collection = 'SystemMonitorApiSlowLog';
    protected static $i18nNamespace = 'SystemMonitorApiSlowLog';

    public function __construct()
    {
        parent::__construct();
        $this->attributes->remove('deletedOn', 'deletedBy', 'modifiedOn', 'modifiedBy', 'createdBy');

        $this->attr('method')->char()->setToArrayDefault();
        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('referer')->char()->setToArrayDefault();
        $this->attr('responseTime')->float()->setToArrayDefault();
        $this->attr('count')->integer()->setDefaultValue(0)->setToArrayDefault();
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);

        // delete records after 7 days
        $indexes->add(new SingleIndex('createdOn', 'createdOn', null, false, false, 604800));
        $indexes->add(new TextIndex('url', 'url'));
        $indexes->add(new SingleIndex('responseTIme', 'responseTime'));
    }
}
