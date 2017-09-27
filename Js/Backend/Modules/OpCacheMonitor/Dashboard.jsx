import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import filesize from 'filesize';
import Graph from './../ApiMonitor/Graph';

/**
 * @i18n.namespace SystemMonitor.Backend.OpCacheMonitor.Dashboard
 */
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
                                [Webiny.I18n('Used'), data.memory_usage.used_memory],
                                [Webiny.I18n('Free'), data.memory_usage.free_memory],
                                [Webiny.I18n('Wasted'), data.memory_usage.wasted_memory]
                            ],
                            type: 'donut'
                        },
                        donut: {
                            title: Webiny.I18n('Memory usage')
                        }
                    },
                    hitsChart: {
                        data: {
                            columns: [
                                [Webiny.I18n('Hits'), data.opcache_statistics.hits],
                                [Webiny.I18n('Misses'), data.opcache_statistics.misses]
                            ],
                            type: 'donut'
                        },
                        donut: {
                            title: Webiny.I18n('Cache hits')
                        }
                    }
                });
            }
        });
    }

    renderRow(name, value, type = null) {
        const {moment} = this.props;
        switch (type) {
            case 'boolean':
                value = value === true ? Webiny.I18n('Yes') : Webiny.I18n('No');
                break;
            case 'filesize':
                value = filesize(value);
                break;
            case 'percentage':
                value = Math.round(value) + '%';
                break;
            case 'time':
                value = value > 0 ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : Webiny.I18n('Never');
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
                value = value === true ? Webiny.I18n('Yes') : Webiny.I18n('No');
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
                <Alert>{this.i18n('OpCache is not configured on your system!')}</Alert>
            );
        }

        const {moment} = this.props;

        return (
            <Tabs size="large">
                <Tabs.Tab label={this.i18n('Status')} icon="icon-gauge">
                    <Grid.Row>
                        <Grid.Col xs={6}>
                            <table className="table table-striped">
                                <tbody>
                                {Object.keys(this.keys).map(key => {
                                    return this.renderRow(key, _.get(this.state.data, key, Webiny.I18n('N/A')), this.keys[key]);
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
                <Tabs.Tab label={this.i18n('Configuration')} icon="icon-cog">
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
                <Tabs.Tab label={this.i18n('Scripts')} icon="fa-file-code-o">
                    <List data={Object.values(this.state.data.scripts)} perPage="50">
                        <List.Table>
                            <List.Table.Row>
                                <List.Table.Field name="full_path" align="left" label={this.i18n('Full path')}/>
                                <List.Table.Field name="hits" align="center" label={this.i18n('Hits')} sort="hits"/>
                                <List.Table.FileSizeField
                                    name="memory_consumption"
                                    align="center"
                                    label={this.i18n('Memory usage')}
                                    sort="memory_consumption"/>
                                <List.Table.Field name="last_used_timestamp" align="center" label={this.i18n('Last used')}>
                                    {({data}) => (
                                        <span>{moment(data.last_used_timestamp * 1000).fromNow()}</span>
                                    )}
                                </List.Table.Field>
                                <List.Table.Actions>
                                    <List.Table.DeleteAction
                                        label={this.i18n('Flush cache')}
                                        message={this.i18n('Are you sure you want to flush cache for this script?')}
                                        confirmButtonlabel={this.i18n('Yes, flush it!')}
                                        onConfirm={({data}) => this.api.post('flush', {script: data.full_path}).then(this.loadData)}/>
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
                    title={this.i18n('OpCache Monitor')}
                    description={this.i18n('This dashboard shows OpCache stats and allows you to flush cache entirely or for specific script.')}>
                    <Logic.Hide if={!this.state.data}>
                        <ClickConfirm message={this.i18n('Are you sure you want to flush entire cache?')}>
                            <Button
                                type="primary"
                                label={this.i18n('Flush entire cache')}
                                icon="fa-trash-o"
                                align="right"
                                onClick={this.flushAllCache}/>
                        </ClickConfirm>
                    </Logic.Hide>
                </View.Header>
                <View.Body noPadding={true}>
                    {this.state.loading ? <Loader/> : null}
                    {this.renderContent()}
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(Dashboard, {
    modules: ['View', 'Logic', 'ClickConfirm', 'Button', 'Grid', 'Alert', 'Tabs', 'List', 'Loader', {moment: 'Webiny/Vendors/Moment'}]
});