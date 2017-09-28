import React from 'react';
import Webiny from 'webiny';
import AddServerModal from './AddServerModal';
import ServerDashboard from './ServerDashboard';

/**
 * @i18n.namespace SystemMonitor.Backend.ResourceMonitor.Dashboard
 */
class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            servers: []
        };
        this.bindMethods('loadServers');
    }

    componentWillMount() {
        super.componentWillMount();
        this.loadServers();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.cancel();
        }
    }

    loadServers() {
        this.setState({loading: true});
        this.request = new Webiny.Api.Endpoint('/entities/system-monitor/servers').get('/', {_fields: 'name,type,lastSnapshot'}).then(apiResponse => {
            if (apiResponse.isError() || apiResponse.isAborted() || !this.isMounted()) {
                return null;
            }

            this.setState({servers: apiResponse.getData('list'), loading: false});
            this.request = null;
        });
    }
}

Dashboard.defaultProps = {
    renderer() {
        const {View, Button, Logic, Grid, Tabs, Loader} = this.props;
        return (
            <View.Dashboard>
                <View.Header
                    title={this.i18n('Resource Monitor')}
                    description={this.i18n('Here you can monitor your servers. Once you setup server agents, data from your servers will be available in this dashboard.')}>
                    <Button align="right" type="primary" icon="icon-plus-circled" onClick={() => this.addServer.show()} label={this.i18n('Add server')}/>
                    <AddServerModal ref={ref => this.addServer = ref} loadServers={this.loadServers}/>
                </View.Header>
                <View.Body>
                    <Logic.Hide if={this.state.servers.length > 0 || this.state.loading}>
                        <Grid.Row>
                            <Grid.Col all={12}>
                                {this.state.loading ? <Loader/> : null}
                                <p>{this.i18n('You have not yet created any servers to monitor. Start by clicking "Add server".')}</p>
                            </Grid.Col>
                        </Grid.Row>
                    </Logic.Hide>
                    <Logic.Hide if={this.state.servers.length === 0}>
                        <Tabs size="large">
                            {this.state.servers.map(s => (
                                <Tabs.Tab key={s.id} label={s.name}>
                                    <ServerDashboard server={s}/>
                                </Tabs.Tab>
                            ))}
                        </Tabs>
                    </Logic.Hide>
                </View.Body>
            </View.Dashboard>
        );
    }
};

export default Webiny.createComponent(Dashboard, {modules: ['View', 'Button', 'Logic', 'Grid', 'Tabs', 'Loader']});