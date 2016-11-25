<?php
namespace Apps\SystemMonitor\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class SystemSnapshot
 *
 * @property string $id
 * @property Array  $stats
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Snapshot extends AbstractEntity
{
    protected static $entityCollection = 'SystemMonitorSnapshots';

    public function __construct()
    {
        parent::__construct();
        $this->index(new SingleIndex('createdOn', 'createdOn', null, false, false, 5184000)); // delete records after 2 months
        $this->index(new SingleIndex('server', 'server'));
        $this->attributes->removeKey(['deletedOn', 'deletedBy', 'modifiedOn', 'modifiedBy']);
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

        // We must allow CRUD CREATE requests for agent scripts
        // TODO: see if this has to be public or maybe include system token in agent scripts?
        $this->api('POST', '/')->setPublic();
    }
}