<?php
namespace Apps\SystemMonitor\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\WebinyTrait;
use Webiny\Component\Entity\EntityCollection;

/**
 * Class SystemSnapshot
 *
 * @property string           $id
 * @property string           $name
 * @property string           $type
 * @property string           $heartbeat
 * @property EntityCollection $snapshots
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Server extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'SystemMonitorServers';

    public function __construct()
    {
        parent::__construct();
        $this->attr('name')->char();
        $this->attr('type')->char();
        $this->attr('heartbeat')->char()->setValidators('url');
        $this->attr('snapshots')->one2many('server')->setEntity('Apps\SystemMonitor\Php\Entities\Snapshot');
        $this->attr('lastSnapshot')->dynamic(function () {
            return Snapshot::find(['server' => $this->id], ['createdOn' => -1], 1)->toArray();
        });

        $this->api('POST', '{id}/agent', function () {
            $replacements = [
                '{serverId}'  => $this->id,
                '{apiToken}'  => $this->wConfig()->get('Application.Acl.Token'),
                '{heartbeat}' => $this->type == 'web' ? $this->heartbeat : '',
                '{reportTo}'  => $this->wConfig()->get('Application.ApiPath') . '/entities/system-monitor/snapshots'
            ];
            $file = $this->str(file_get_contents(__DIR__ . '/../Agent/agent.php'));
            $file = $file->replace(array_keys($replacements), array_values($replacements))->val();

            header('Pragma: public');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Content-Type: text/plain');
            header('Content-Transfer-Encoding: binary');
            header('Content-Disposition: attachment; filename="webiny-agent.php"');
            echo $file;
            die();

        });

        $this->api('GET', '{id}/snapshots/{preset}', function ($preset) {
            $intervals = [
                '1h'  => 'PT1H',
                '2h'  => 'PT2H',
                '6h'  => 'PT6H',
                '24h' => 'PT24H',
                '7d'  => 'P7D',
                '30d' => 'P30D',
            ];

            $patterns = [
                '1h'  => ['i', 1],
                '2h'  => ['i', 2],
                '6h'  => ['i', 5],
                '24h' => ['i', 10],
                '7d'  => ['i', 30],
                '30d' => ['H', 2]
            ];

            $timeKey = 'time.' . $patterns[$preset][0];
            $query = [
                'server'    => $this->id,
                'createdOn' => [
                    '$gte' => $this->datetime()->sub($intervals[$preset])->getMongoDate(),
                    '$lte' => $this->datetime()->getMongoDate()
                ],
                '$or'       => [
                    [$timeKey => ['$mod' => [$patterns[$preset][1], 0]]],
                    [$timeKey => 0]
                ]
            ];

            // TODO: need to add check for missing intervals and insert 0 stats to keep chart consistent across time.

            return Snapshot::find($query, ['createdOn' => 1])->toArray();
        });
    }
}