<?php
namespace Apps\SystemMonitor\Php\Listeners;

use Apps\Core\Php\DevTools\Response\ApiCacheResponse;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\SystemMonitor\Php\Entities\ApiSlowLog;
use Apps\SystemMonitor\Php\Entities\ApiSnapshot;

class ApiListener
{
    use WebinyTrait;

    public function onBefore(ApiEvent $event)
    {
        // if instance of ApiCacheResponse, means the response will be delivered from cache
        // without additional processing so Core.Api.After won't be called
        if ($event->getResponse() instanceof ApiCacheResponse) {
            $this->logEntry(true);
        }
    }

    public function onAfter(ApiEvent $event)
    {
        $this->logEntry(false);
    }

    private function logEntry($cacheHit)
    {
        // get response time in milliseconds
        $responseTime = getrusage()['ru_utime.tv_sec'];

        // log request
        $apiSnapshot = new ApiSnapshot();
        $apiSnapshot->logRequest($responseTime, $cacheHit);

        // log slow api
        if ($responseTime > 200) { // slow query threshold @todo add to config

            $slowLog = ApiSlowLog::findOne(['url' => $this->wRequest()->getCurrentUrl()]);
            if ($slowLog && $slowLog->method == $this->wRequest()->getRequestMethod()) {
                $slowLog->count++;
                $slowLog->save();
            } else {
                $slowLog = new ApiSlowLog();
                $slowLog->responseTime = $responseTime;
                $slowLog->url = $this->wRequest()->getCurrentUrl();
                $slowLog->method = $this->wRequest()->getRequestMethod();
                $slowLog->referer = $this->wRequest()->server()->httpReferer();
                $slowLog->save();
            }
        }

    }
}
