import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
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
        const change = (
            <Ui.Dropdown title={this.options[this.state.snapshotsRange]} className="balloon">
                <Ui.Dropdown.Link title="Last hour" onClick={() => this.loadStats('1h')}/>
                <Ui.Dropdown.Link title="Last 6 hours" onClick={() => this.loadStats('6h')}/>
                <Ui.Dropdown.Link title="Last 24 hours" onClick={() => this.loadStats('24h')}/>
                <Ui.Dropdown.Link title="Last 7 days" onClick={() => this.loadStats('7d')}/>
                <Ui.Dropdown.Link title="Last 30 days" onClick={() => this.loadStats('30d')}/>
            </Ui.Dropdown>
        );

        const listProps = {
            api: '/entities/system-monitor/api-slow-log',
            fields: '*',
            searchFields: 'url',
            connectToRouter: true
        };

        const searchProps = {
            placeholder: 'Search by url',
            name: '_searchQuery'
        };

        return (
            <api-monitor>
                <Ui.View.Dashboard>
                    <Ui.View.Header
                        title="Api Monitor"
                        description="This dashboard shows API response times and cache efficiency.">
                    </Ui.View.Header>
                    <Ui.View.Body>

                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={6}>
                                <Ui.View.ChartBlock title="Api Requests" description={change}>
                                    <Graph config={this.getApiRequests(this.state.snapshots)}/>
                                </Ui.View.ChartBlock>
                            </Ui.Grid.Col>

                            <Ui.Grid.Col all={6}>
                                <Ui.View.ChartBlock title="Api Response Time" description={change}>
                                    <Graph config={this.getResponseTime(this.state.snapshots)}/>
                                </Ui.View.ChartBlock>
                            </Ui.Grid.Col>

                        </Ui.Grid.Row>

                    </Ui.View.Body>

                </Ui.View.Dashboard>

                <Ui.View.List>
                    <Ui.View.Body>
                        <h2>Slow Api Log</h2>
                        <Ui.List {...listProps}>
                            <Ui.List.FormFilters>
                                {(applyFilters, resetFilters) => (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={10}>
                                            <Ui.Input {...searchProps} onEnter={applyFilters()}/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={2}>
                                            <Ui.Button type="secondary" align="right" label="Reset Filters" onClick={resetFilters()}/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                )}
                            </Ui.List.FormFilters>

                            <Table>
                                <Table.Row>
                                    <Table.Field name="method" align="left" label="Method" sort="method"/>
                                    <Table.Field name="url" align="left" label="Url" sort="Url"/>
                                    <Table.Field name="referer" align="left" label="Referer" sort="referer"/>
                                    <Table.Field name="responseTime" align="center" label="Response Time" sort="responseTime"/>
                                </Table.Row>
                            </Table>

                            <Ui.List.Pagination/>
                        </Ui.List>
                    </Ui.View.Body>
                </Ui.View.List>
            </api-monitor>

        );
    }
};

export default Dashboard;