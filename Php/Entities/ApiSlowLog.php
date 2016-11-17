<?php
namespace Apps\SystemMonitor\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;
use Webiny\Component\Mongo\Index\TextIndex;

/**
 * Class SystemSnapshot
 *
 * @property string  $id
 * @property string  method
 * @property string  url
 * @property string  referer
 * @property float   responseTime
 * @property integer count
 *
 * @package Apps\Core\Php\Entities
 *
 */
class ApiSlowLog extends AbstractEntity
{
    protected static $entityCollection = 'SystemMonitorApiSlowLog';

    public function __construct()
    {
        parent::__construct();
        $this->index(new SingleIndex('createdOn', 'createdOn', null, false, false, 604800)); // delete records after 7 days
        $this->index(new TextIndex('url', 'url'));
        $this->index(new SingleIndex('responseTIme', 'responseTime'));

        $this->attributes->removeKey(['deletedOn', 'deletedBy', 'modifiedOn', 'modifiedBy', 'createdBy']);

        $this->attr('method')->char()->setToArrayDefault();
        $this->attr('url')->char()->setToArrayDefault();
        $this->attr('referer')->char()->setToArrayDefault();
        $this->attr('responseTime')->float()->setToArrayDefault();
        $this->attr('count')->integer()->setDefaultValue(0)->setToArrayDefault();
    }

}
