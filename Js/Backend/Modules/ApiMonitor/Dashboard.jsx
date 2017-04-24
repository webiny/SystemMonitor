import Webiny from 'Webiny';
import Graph from './Graph';

class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            snapshots: [],
            snapshotsRange: '1h'
        };
        this.interval = null;
        this.options = {
            '1h': 'Last hour',
            '6h': 'Last 6 hours',
            '24h': 'Last 24 hours',
            '7d': 'Last 7 days',
            '30d': 'Last 30 days'
        };
    }

    componentWillMount() {
        super.componentWillMount();
        this.loadStats();
    }

    loadStats(preset = '1h') {
        this.setState({loading: true});
        this.request = new Webiny.Api.Endpoint('/entities/system-monitor/api-snapshot').get('/stats/' + preset).then(apiResponse => {
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

    getApiRequests(snapshots) {
        const cacheHit = ['Cache Hit'].concat(_.map(snapshots, x => x.hitCount));
        const cacheMiss = ['Cache Miss'].concat(_.map(snapshots, x => x.missCount));

        return this.getLineChartConfig(snapshots, [cacheHit, cacheMiss]);
    }

    getResponseTime(snapshots) {
        const responseTime = ['Mean response time (ms)'].concat(_.map(snapshots, x => (x.totalTime / x.numRequests).toFixed(2)));

        return this.getLineChartConfig(snapshots, [responseTime]);
    }
}

Dashboard.defaultProps = {
    renderer() {
        const listProps = {
            api: '/entities/system-monitor/api-slow-log',
            fields: '*',
            searchFields: 'url',
            connectToRouter: true
        };

        const searchProps = {
            placeholder: 'Search by URL',
            name: '_searchQuery'
        };

        const {Dropdown, View, Grid, List, Input, Button} = this.props;

        const change = (
            <Dropdown title={this.options[this.state.snapshotsRange]} className="balloon">
                <Dropdown.Link title="Last hour" onClick={() => this.loadStats('1h')}/>
                <Dropdown.Link title="Last 6 hours" onClick={() => this.loadStats('6h')}/>
                <Dropdown.Link title="Last 24 hours" onClick={() => this.loadStats('24h')}/>
                <Dropdown.Link title="Last 7 days" onClick={() => this.loadStats('7d')}/>
                <Dropdown.Link title="Last 30 days" onClick={() => this.loadStats('30d')}/>
            </Dropdown>
        );

        return (
            <api-monitor>
                <View.Dashboard>
                    <View.Header
                        title="API Monitor"
                        description="This dashboard shows API response times and cache efficiency.">
                    </View.Header>
                    <View.Body>
                        <Grid.Row>
                            <Grid.Col all={6}>
                                <View.ChartBlock title="API Requests" description={change}>
                                    <Graph config={this.getApiRequests(this.state.snapshots)}/>
                                </View.ChartBlock>
                            </Grid.Col>
                            <Grid.Col all={6}>
                                <View.ChartBlock title="API Response Time" description={change}>
                                    <Graph config={this.getResponseTime(this.state.snapshots)}/>
                                </View.ChartBlock>
                            </Grid.Col>
                        </Grid.Row>
                    </View.Body>
                </View.Dashboard>
                <View.List>
                    <View.Body>
                        <h2>API Log</h2>
                        <List {...listProps}>
                            <List.FormFilters>
                                {(applyFilters, resetFilters) => (
                                    <Grid.Row>
                                        <Grid.Col all={10}>
                                            <Input {...searchProps} onEnter={applyFilters()}/>
                                        </Grid.Col>
                                        <Grid.Col all={2}>
                                            <Button type="secondary" align="right" label="Reset Filters" onClick={resetFilters()}/>
                                        </Grid.Col>
                                    </Grid.Row>
                                )}
                            </List.FormFilters>
                            <List.Table>
                                <List.Table.Row>
                                    <List.Table.Field name="method" align="left" label="Method" sort="method"/>
                                    <List.Table.Field name="url" align="left" label="URL" sort="url"/>
                                    <List.Table.Field name="referer" align="left" label="Referrer" sort="referer"/>
                                    <List.Table.Field name="responseTime" align="center" label="Response Time" sort="responseTime"/>
                                </List.Table.Row>
                            </List.Table>
                            <List.Pagination/>
                        </List>
                    </View.Body>
                </View.List>
            </api-monitor>

        );
    }
};

export default Webiny.createComponent(Dashboard, {modules: ['Dropdown', 'View', 'Grid', 'List', 'Input', 'Button']});