import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import Graph from './../ApiMonitor/Graph';

class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: false
        };

        this.keys = {
            'cache_full': 'boolean',
            'memory_usage.used_memory': 'filesize',
            'memory_usage.free_memory': 'filesize',
            'memory_usage.wasted_memory': 'filesize',
            'memory_usage.current_wasted_percentage': 'percentage',
            'opcache_statistics.num_cached_scripts': 'integer',
            'opcache_statistics.num_cached_keys': 'integer',
            'opcache_statistics.max_cached_keys': 'integer',
            'opcache_statistics.hits': 'integer',
            'opcache_statistics.last_restart_time': 'time',
            'opcache_statistics.misses': 'integer',
            'opcache_statistics.blacklist_misses': 'integer',
            'opcache_statistics.opcache_hit_rate': 'percentage'
        };

        this.api = new Webiny.Api.Endpoint('/services/system-monitor/op-cache');

        this.bindMethods('loadData,flushAllCache');
    }

    componentWillMount() {
        super.componentWillMount();
        this.loadData();
    }

    loadData() {
        this.setState({loading: true});
        return this.api.get('/').then(apiResponse => {
            const data = apiResponse.getData();
            this.setState({data, loading: false});
            if (data) {
                this.setState({
                    memoryUsageChart: {
                        data: {
                            columns: [
                                ['Used', data.memory_usage.used_memory],
                                ['Free', data.memory_usage.free_memory],
                                ['Wasted', data.memory_usage.wasted_memory]
                            ],
                            type: 'donut'
                        },
                        donut: {
                            title: 'Memory usage'
                        }
                    },
                    hitsChart: {
                        data: {
                            columns: [
                                ['Hits', data.opcache_statistics.hits],
                                ['Misses', data.opcache_statistics.misses]
                            ],
                            type: 'donut'
                        },
                        donut: {
                            title: 'Cache hits'
                        }
                    }
                });
            }
        });
    }

    renderRow(name, value, type = null) {
        switch (type) {
            case 'boolean':
                value = value === true ? 'Yes' : 'No';
                break;
            case 'filesize':
                value = filesize(value);
                break;
            case 'percentage':
                value = Math.round(value) + '%';
                break;
            case 'time':
                value = value > 0 ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : 'Never';
                break;
            default:
                break;
        }

        return (
            <tr key={name}>
                <th className="text-left">{name.split('.').pop()}</th>
                <td className="text-right">{value}</td>
            </tr>
        );
    }

    renderConfigRow(name, value, type) {
        if (!type) {
            type = typeof value;
        }

        switch (type) {
            case 'boolean':
                value = value === true ? 'Yes' : 'No';
                break;
            default:
                break;
        }

        return (
            <tr key={name}>
                <th className="text-left">{name}</th>
                <td className="text-right">{value}</td>
            </tr>
        );
    }

    flushAllCache() {
        return this.api.post('flush-all').then(this.loadData);
    }

    createChart() {
        var chart = c3.generate({
            data: {
                // iris data from R
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type: 'pie',
                onclick: function (d, i) {
                    console.log("onclick", d, i);
                },
                onmouseover: function (d, i) {
                    console.log("onmouseover", d, i);
                },
                onmouseout: function (d, i) {
                    console.log("onmouseout", d, i);
                }
            }
        });
    }

    renderContent() {
        if (this.state.data === null) {
            return null;
        }

        if (this.state.data === false) {
            return (
                <Ui.Grid.Col xs={12}>
                    <Ui.Alert>OpCache is not configured on your system!</Ui.Alert>
                </Ui.Grid.Col>
            );
        }

        return (
            <Ui.Tabs size="large">
                <Ui.Tabs.Tab label="Status" icon="icon-gauge">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col xs={6}>
                            <table className="table table-striped">
                                <tbody>
                                {Object.keys(this.keys).map(key => {
                                    return this.renderRow(key, _.get(this.state.data, key, 'N/A'), this.keys[key]);
                                })}
                                </tbody>
                            </table>
                        </Ui.Grid.Col>
                        <Ui.Grid.Col xs={6}>
                            <Graph config={this.state.memoryUsageChart}/>
                            <Graph config={this.state.hitsChart}/>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
                <Ui.Tabs.Tab label="Configuration" icon="icon-cog">
                    <Ui.Grid.Row>
                        <Ui.Grid.Col xs={12}>
                            <table className="table table-striped">
                                <tbody>
                                {Object.keys(this.state.data.configuration.directives).map(key => {
                                    return this.renderConfigRow(key, this.state.data.configuration.directives[key]);
                                })}
                                </tbody>
                            </table>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                </Ui.Tabs.Tab>
                <Ui.Tabs.Tab label="Scripts" icon="fa-file-code-o">
                    <Ui.List data={Object.values(this.state.data.scripts)} perPage="50">
                        <Table>
                            <Table.Row>
                                <Table.Field name="full_path" align="left" label="Full path"/>
                                <Table.Field name="hits" align="center" label="Hits" sort="hits"/>
                                <Table.FileSizeField
                                    name="memory_consumption"
                                    align="center"
                                    label="Memory usage"
                                    sort="memory_consumption"/>
                                <Table.Field name="last_used_timestamp" align="center" label="Last used">
                                    {row => (
                                        <span>{moment(row.last_used_timestamp * 1000).fromNow()}</span>
                                    )}
                                </Table.Field>
                                <Table.Actions>
                                    <Table.DeleteAction
                                        label="Flush cache"
                                        message="Are you sure you want to flush cache for this script?"
                                        confirmButtonLabel="Yes, flush it!"
                                        onConfirm={record => {
                                                        return this.api.post('flush', {script: record.full_path}).then(this.loadData);
                                                    }
                                                }/>
                                </Table.Actions>
                            </Table.Row>
                        </Table>
                        <Ui.List.Pagination/>
                    </Ui.List>
                </Ui.Tabs.Tab>
            </Ui.Tabs>
        );
    }
}

Dashboard.defaultProps = {
    renderer() {
        return (
            <Ui.View.List>
                <Ui.View.Header
                    title="OpCache Monitor"
                    description="This dashboard shows OpCache stats and allows you to flush cache entirely or for specific script.">
                    <Ui.Logic.Hide if={!this.state.data}>
                        <Ui.ClickConfirm message="Are you sure you want to flush entire cache?">
                            <Ui.Button
                                type="primary"
                                label="Flush entire cache"
                                icon="fa-trash-o"
                                align="right"
                                onClick={this.flushAllCache}/>
                        </Ui.ClickConfirm>
                    </Ui.Logic.Hide>
                </Ui.View.Header>
                <Ui.View.Body>
                    {this.state.loading ? <Ui.Loader/> : null}
                    {this.renderContent()}
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default Dashboard;