<?php
define('WBY_SERVER', '{serverId}'); // Tu ide ID servera iz baze
define('WBY_WEBSERVER', '{heartbeat}'); // Url koji treba pingati da se vidi dal je server ziv
define('WBY_REPORT_TO', '{reportTo}'); // Kamo se reporta snapshot
define('WBY_API_TOKEN', '{apiToken}'); // Api token sistema u koji se reporta

// Get `top` output
exec('top -b -d2 -n2', $top);
// Find last output
$linesNumber = count($top);
for ($i = $linesNumber - 1; $i >= 0; $i--) {
    if (strpos($top[$i], 'top -') === 0) {
        $top = array_slice($top, $i, 4);
        break;
    }
}
// Load average
preg_match('/load average:\s+([\d+\.]+),\s+([\d+\.]+),\s+([\d+\.]+)/', $top[0], $loads);
$stats['loadAverage'] = array('1' => floatval($loads[1]), '5' => floatval($loads[2]), '15' => floatval($loads[3]));
// CPU
preg_match_all('/([\d+\.]+)/', $top[2], $loads);
$stats['cpu'] = array('user' => floatval($loads[0][0]), 'system' => floatval($loads[0][1]));
unset($loads);
// Memory
preg_match_all('/(\d+)/', $top[3], $memory);
$stats['memory'] = array('total' => intval($memory[0][0]), 'used' => intval($memory[0][1]), 'free' => intval($memory[0][2]));
unset($memory);
// Disk usage
exec('df --local --output=source,size,used,avail,pcent', $diskUsage);

$toBytes = function ($mb) {
    return intval(rtrim($mb, 'K')) * 1024;
};

$disks = count($diskUsage);
for ($i = 1; $i < $disks; $i++) {
    if (strpos($diskUsage[$i], '/dev/') === false) {
        continue;
    }

    $disk = preg_split('/\s+/', $diskUsage[$i]);

    $stats['disks'][] = array(
        'name'       => $disk[0],
        'size'       => $toBytes($disk[1]),
        'used'       => $toBytes($disk[2]),
        'available'  => $toBytes($disk[3]),
        'percentage' => intval(rtrim($disk[4], '%'))
    );
}
unset($diskUsage);

// Top 5 memory consuming processes
exec('ps -eo pid,pcpu,pmem,cmd --sort -pmem --no-headers | head -5', $processes);
foreach ($processes as $p) {
    list($pid, $cpu, $mem, $cmd) = preg_split('/\s+/', trim($p), 4);
    $stats['memory']['processes'][] = array('pid' => intval($pid), 'cpu' => floatval($cpu), 'memory' => floatval($mem), 'cmd' => $cmd);
}

if (WBY_WEBSERVER !== '') {
    $stats['alive'] = false;
    $ch = curl_init(WBY_WEBSERVER);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    if (curl_getinfo($ch)['http_code'] == 200) {
        $stats['alive'] = true;
    }
    curl_close($ch);
}

// Report snapshot data
$ch = curl_init(WBY_REPORT_TO);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('server' => WBY_SERVER, 'stats' => $stats)));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-Webiny-Api-Token: ' . WBY_API_TOKEN));
curl_exec($ch);
curl_close($ch);

