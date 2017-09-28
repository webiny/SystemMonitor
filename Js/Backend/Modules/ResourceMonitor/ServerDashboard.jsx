import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Graph from './Graph';

/**
 * @i18n.namespace SystemMonitor.Backend.ResourceMonitor.ServerDashboard
 */
class ServerDashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            snapshots: [],
            snapshotsRange: '1h'
        };

        this.api = new Webiny.Api.Endpoint('/entities/system-monitor/servers');
        this.interval = null;
        this.options = {
            '1h': this.i18n('Last hour'),
            '6h': this.i18n('Last 6 hours'),
            '24h': this.i18n('Last 24 hours'),
            '7d': this.i18n('Last 7 days'),
            '30d': this.i18n('Last 30 days')
        };
        this.bindMethods('loadStats', 'getCpuConfig', 'getMemoryConfig', 'getTimeline', 'getDiskConfig');
    }

    componentWillMount() {
        super.componentWillMount();
        this.loadStats();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.cancel();
        }

        clearInterval(this.interval);
    }

    loadStats(preset = '1h') {
        this.setState({loading: true});
        this.request = this.api.get(this.props.server.id + '/snapshots/' + preset).then(apiResponse => {
            if (apiResponse.isError() || apiResponse.isAborted() || !this.isMounted()) {
                return null;
            }

            this.setState({
                snapshots: apiResponse.getData(),
                loading: false,
                snapshotsRange: preset
            });
            this.request = null;
        });
    }

    getTimeline(snapshots) {
        return ['x'].concat(_.map(snapshots, s => new Date(s.createdOn)));
    }

    getLineChartConfig(snapshots, columns) {
        columns.unshift(this.getTimeline(snapshots));

        return {
            data: {
                x: 'x',
                columns
            },
            point: {
                show: false
            },
            zoom: {
                enabled: true
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M',
                        count: 20
                    }
                },
                y: {
                    min: 0
                }
            },
            tooltip: {
                format: {
                    title: d => d
                }
            }
        };
    }

    getGaugeChartConfig(columns) {
        return {
            data: {
                columns: [columns],
                type: 'gauge'
            },
            color: {
                pattern: ['#60B044', '#F6C600', '#F97600', '#FF0000'],
                threshold: {
                    values: [30, 60, 90, 100]
                }
            },
            size: {
                height: 180
            }
        };
    }

    getDonutChartConfig(name, columns) {
        return {
            data: {
                columns,
                type: 'donut',
                colors: {
                    Free: '#E0E0E0',
                    Used: '#FA5722'
                }
            },
            donut: {
                title: name,
                width: 60
            }
        };
    }



    getCpuConfig(snapshots) {
        const userColumns = [Webiny.I18n('User')].concat(_.map(snapshots, x => x.stats.cpu.user));
        const systemColumns = [Webiny.I18n('System')].concat(_.map(snapshots, x => x.stats.cpu.system));

        return this.getLineChartConfig(snapshots, [userColumns, systemColumns]);
    }

    getMemoryConfig(snapshots) {
        const userColumns = [Webiny.I18n('Memory used')].concat(_.map(snapshots, s => Math.round((s.stats.memory.used / s.stats.memory.total) * 100)));

        return this.getLineChartConfig(snapshots, [userColumns]);
    }

    getDiskConfig(disk) {
        if (!disk) {
            return null;
        }
        return this.getDonutChartConfig(disk.name, [
            [Webiny.I18n('Used'), disk.percentage],
            [Webiny.I18n('Free'), 100 - disk.percentage]
        ]);
    }

    getLoadAverageConfig(name, load) {
        if (!load) {
            return null;
        }
        return this.getGaugeChartConfig([name, Math.round(load * 100)]);
    }
}

ServerDashboard.defaultProps = {
    renderer() {
        const {Dropdown, DownloadLink, Grid, Logic, Loader, Button, View, Icon} = this.props;
        const change = (
            <Dropdown title={this.options[this.state.snapshotsRange]} className="balloon">
                <Dropdown.Link title={this.i18n('Last hour')} onClick={() => this.loadStats('1h')}/>
                <Dropdown.Link title={this.i18n('Last 6 hours')} onClick={() => this.loadStats('6h')}/>
                <Dropdown.Link title={this.i18n('Last 24 hours')} onClick={() => this.loadStats('24h')}/>
                <Dropdown.Link title={this.i18n('Last 7 days')} onClick={() => this.loadStats('7d')}/>
                <Dropdown.Link title={this.i18n('Last 30 days')} onClick={() => this.loadStats('30d')}/>
            </Dropdown>
        );

        const disk = _.get(_.last(this.state.snapshots), 'stats.disks.0');
        const loadAverage = _.get(_.last(this.state.snapshots), 'stats.loadAverage');
        const agentDownload = (
            <DownloadLink
                type="primary"
                align="right"
                download={d => d('POST', `/entities/system-monitor/server/${this.props.server.id}/agent`)}>
                <Icon icon="fa-code"/> {this.i18n('Download agent script')}
            </DownloadLink>
        );

        return (
            <Grid.Row>
                {this.state.loading ? <Loader/> : null}
                <Logic.Hide if={this.state.snapshots.length > 0 || this.state.loading}>
                    <Grid.Col all={9}>
                        <p>
                            {this.i18n(`There are no snapshots recorded for this server so far.
                                        To start monitoring your server, download an agent
                                        script and place it anywhere you want on the server.
                                        After that add a crontab entry to run this script every minute, ex:`)}
                        </p>
                        <code>* * * * * php ~/www/monitor/webiny-agent.php</code>
                    </Grid.Col>
                    <Grid.Col all={3}>{agentDownload}</Grid.Col>
                </Logic.Hide>
                <Logic.Hide if={this.state.snapshots.length === 0}>
                    <Grid.Col all={12}>
                        {agentDownload}
                        <Button
                            align="right"
                            onClick={() => this.loadStats(this.state.snapshotsRange)}
                            type="secondary"
                            label={this.i18n('Refresh')}
                            icon="fa-refresh"/>
                    </Grid.Col>
                    <Grid.Col all={6}>
                        <View.ChartBlock title={this.i18n('CPU usage (%)')} description={change}>
                            <Graph config={this.getCpuConfig(this.state.snapshots)}/>
                        </View.ChartBlock>
                    </Grid.Col>
                    <Grid.Col all={6}>
                        <View.ChartBlock title={this.i18n('Memory usage (%)')} description={change}>
                            <Graph config={this.getMemoryConfig(this.state.snapshots)}/>
                        </View.ChartBlock>
                    </Grid.Col>
                    <Grid.Col all={3}>
                        <View.ChartBlock title={this.i18n('Disk usage (%)')}>
                            <Graph config={this.getDiskConfig(disk)}/>
                        </View.ChartBlock>
                    </Grid.Col>
                    <Grid.Col all={9}>
                        <View.ChartBlock title={this.i18n('System load averages')}>
                            <Grid.Col all={4}>
                                <h3 className="text-center">1 min</h3>
                                <Graph config={this.getLoadAverageConfig('1 minute', _.get(loadAverage, 1))}/>
                            </Grid.Col>
                            <Grid.Col all={4}>
                                <h3 className="text-center">5 min</h3>
                                <Graph config={this.getLoadAverageConfig('5 minutes', _.get(loadAverage, 5))}/>
                            </Grid.Col>
                            <Grid.Col all={4}>
                                <h3 className="text-center">15 min</h3>
                                <Graph config={this.getLoadAverageConfig('15 minutes', _.get(loadAverage, 15))}/>
                            </Grid.Col>
                        </View.ChartBlock>
                    </Grid.Col>
                </Logic.Hide>
            </Grid.Row>
        );
    }
};

export default Webiny.createComponent(ServerDashboard, {
    modules: ['Dropdown', 'DownloadLink', 'Grid', 'Logic', 'Loader', 'Button', 'View', 'Icon']
});