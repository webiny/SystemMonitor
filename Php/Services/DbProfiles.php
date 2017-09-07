<?php
namespace Apps\SystemMonitor\Php\Services;

use Apps\Webiny\Php\Lib\Api\ApiContainer;
use Apps\Webiny\Php\Lib\Services\AbstractService;
use MongoDB\BSON\Regex;

/**
 * Class DbProfiles
 *
 * @package Apps\SystemMonitor\Php\Services
 *
 */
class DbProfiles extends AbstractService
{
    protected function serviceApi(ApiContainer $api)
    {
        $api->get('/', function () {
            $perPage = $this->wRequest()->getPerPage(100);
            $page = $this->wRequest()->getPage(1);
            $filter = $this->wRequest()->getFilters();
            $sort = $this->wRequest()->getSortFields();

            if (!isset($filter['ns'])) {
                $filter['ns'] = ['$not' => new Regex('system.', '')];
            }

            $profiles = $this->wDatabase()->find('system.profile', $filter, $sort, $perPage, $perPage * ($page - 1));
            $totalCount = $this->wDatabase()->count('system.profile', $filter);
            foreach ($profiles as $i => $p) {
                $profiles[$i]['id'] = uniqid();
                $profiles[$i]['ts'] = $p['ts']->toDateTime()->format(DATE_ISO8601);
            }

            return [
                'meta' => [
                    'totalCount'  => count($profiles),
                    'totalPages'  => $perPage > 0 ? ceil($totalCount / $perPage) : 1,
                    'perPage'     => $perPage,
                    'currentPage' => $page
                ],
                'list' => $profiles
            ];
        });

        $api->get('namespaces', function () {
            return $this->wDatabase()->distinct('system.profile', 'ns', ['ns' => ['$not' => new Regex('system.', '')]]);
        });
    }
}
