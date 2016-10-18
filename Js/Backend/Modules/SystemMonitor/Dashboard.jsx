import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import SettingsModal from './SettingsModal';
import AddServerModal from './AddServerModal';
import ServerDashboard from './ServerDashboard';

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
            this.request.abort();
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
        return (
            <Ui.View.Dashboard>
                <Ui.View.Header
                    title="System Monitor"
                    description="Here you can monitor your servers. Once you setup server agents, data from your servers will be available in this dashboard.">
                    <Ui.Button align="right" type="primary" icon="icon-plus-circled" onClick={this.ui('addServer:show')} label="Add server"/>
                    <Ui.Button align="right" type="secondary" icon="icon-cog" onClick={this.ui('settingsModal:show')} label="Setup alarms"/>
                    <AddServerModal ui="addServer" loadServers={this.loadServers}/>
                    <SettingsModal ui="settingsModal"/>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.Hide if={this.state.servers.length > 0 || this.state.loading}>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                {this.state.loading ? <Ui.Loader/> : null}
                                <p>You have not yet created any servers to monitor. Start by clicking "Add server".</p>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </Ui.Hide>
                    <Ui.Hide if={this.state.servers.length === 0}>
                        <Ui.Tabs size="large">
                            {this.state.servers.map(s => (
                                <Ui.Tabs.Tab key={s.id} label={s.name}>
                                    <ServerDashboard server={s}/>
                                </Ui.Tabs.Tab>
                            ))}
                        </Ui.Tabs>
                    </Ui.Hide>
                </Ui.View.Body>
            </Ui.View.Dashboard>
        );
    }
};

export default Dashboard;