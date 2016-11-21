<?php
namespace Apps\SystemMonitor\Php\Listeners;

use Apps\Core\Php\DevTools\Response\ApiCacheResponse;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\RequestHandlers\ApiEvent;
use Apps\SystemMonitor\Php\Entities\ApiSlowLog;
use Apps\SystemMonitor\Php\Entities\ApiSnapshot;
use Apps\SystemMonitor\Php\Entities\Settings;

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
        // check that api monitor is active
        $settings = Settings::load();
        if (!$settings) {
            return false;
        }
        $settings = $settings['apiMonitor'];
        if ($settings['status'] < 1) {
            return false;
        }

        // get response time in milliseconds
        $responseTime = round((microtime(true) - $this->wRequest()->server()->requestTime(true)) * 1000);

        // log request
        $apiSnapshot = new ApiSnapshot();
        $apiSnapshot->logRequest($responseTime, $cacheHit);

        // log slow api
        if ($responseTime >= $settings['slowLogThreshold']) {

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
