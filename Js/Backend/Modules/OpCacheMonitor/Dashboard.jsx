import Webiny from 'Webiny';
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

    renderContent() {
        if (this.state.data === null) {
            return null;
        }

        const {Grid, Alert, Tabs, List} = this.props;

        if (this.state.data === false) {
            return (
                <Grid.Col xs={12}>
                    <Alert>OpCache is not configured on your system!</Alert>
                </Grid.Col>
            );
        }

        return (
            <Tabs size="large">
                <Tabs.Tab label="Status" icon="icon-gauge">
                    <Grid.Row>
                        <Grid.Col xs={6}>
                            <table className="table table-striped">
                                <tbody>
                                {Object.keys(this.keys).map(key => {
                                    return this.renderRow(key, _.get(this.state.data, key, 'N/A'), this.keys[key]);
                                })}
                                </tbody>
                            </table>
                        </Grid.Col>
                        <Grid.Col xs={6}>
                            <Graph config={this.state.memoryUsageChart}/>
                            <Graph config={this.state.hitsChart}/>
                        </Grid.Col>
                    </Grid.Row>
                </Tabs.Tab>
                <Tabs.Tab label="Configuration" icon="icon-cog">
                    <Grid.Row>
                        <Grid.Col xs={12}>
                            <table className="table table-striped">
                                <tbody>
                                {Object.keys(this.state.data.configuration.directives).map(key => {
                                    return this.renderConfigRow(key, this.state.data.configuration.directives[key]);
                                })}
                                </tbody>
                            </table>
                        </Grid.Col>
                    </Grid.Row>
                </Tabs.Tab>
                <Tabs.Tab label="Scripts" icon="fa-file-code-o">
                    <List data={Object.values(this.state.data.scripts)} perPage="50">
                        <List.Table>
                            <List.Table.Row>
                                <List.Table.Field name="full_path" align="left" label="Full path"/>
                                <List.Table.Field name="hits" align="center" label="Hits" sort="hits"/>
                                <List.Table.FileSizeField
                                    name="memory_consumption"
                                    align="center"
                                    label="Memory usage"
                                    sort="memory_consumption"/>
                                <List.Table.Field name="last_used_timestamp" align="center" label="Last used">
                                    {row => (
                                        <span>{moment(row.last_used_timestamp * 1000).fromNow()}</span>
                                    )}
                                </List.Table.Field>
                                <List.Table.Actions>
                                    <List.Table.DeleteAction
                                        label="Flush cache"
                                        message="Are you sure you want to flush cache for this script?"
                                        confirmButtonLabel="Yes, flush it!"
                                        onConfirm={record => this.api.post('flush', {script: record.full_path}).then(this.loadData)}/>
                                </List.Table.Actions>
                            </List.Table.Row>
                        </List.Table>
                        <List.Pagination/>
                    </List>
                </Tabs.Tab>
            </Tabs>
        );
    }
}

Dashboard.defaultProps = {
    renderer() {
        const {View, ClickConfirm, Button, Logic, Loader} = this.props;
        return (
            <View.List>
                <View.Header
                    title="OpCache Monitor"
                    description="This dashboard shows OpCache stats and allows you to flush cache entirely or for specific script.">
                    <Logic.Hide if={!this.state.data}>
                        <ClickConfirm message="Are you sure you want to flush entire cache?">
                            <Button
                                type="primary"
                                label="Flush entire cache"
                                icon="fa-trash-o"
                                align="right"
                                onClick={this.flushAllCache}/>
                        </ClickConfirm>
                    </Logic.Hide>
                </View.Header>
                <View.Body>
                    {this.state.loading ? <Loader/> : null}
                    {this.renderContent()}
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(Dashboard, {
    modules: ['View', 'Logic', 'ClickConfirm', 'Button', 'Grid', 'Alert', 'Tabs', 'List', 'Loader']
});