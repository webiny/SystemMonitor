import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsForm extends Webiny.Ui.View {

}

SettingsForm.defaultProps = {
    renderer() {
        return (
            <Ui.Settings api="/entities/system-monitor/settings">
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header
                            title="System Monitor Settings"
                            description="Set your system monitor settings here"/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs size="large">
                                <Ui.Tabs.Tab label="API Monitor" icon="fa-rocket">
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Switch
                                            label="API monitor"
                                            name="apiMonitor.status"
                                            description="Turn API monitor on or off"/>
                                        <Ui.Input
                                            label="Slow log threshold"
                                            name="apiMonitor.slowLogThreshold"
                                            validate={_.get(model, 'apiMonitor.status', false) ? 'required,gte:0' : null}
                                            description="All API responses above this response time will be logged to the slow log. Note: response time is defined in milliseconds."/>
                                    </Ui.Grid.Col>
                                </Ui.Tabs.Tab>
                                <Ui.Tabs.Tab label="Database Monitor" icon="fa-database">
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Switch
                                            label="Database monitor"
                                            name="dbMonitor.status"
                                            description="Turn DB monitor on or off"/>
                                        <Ui.Input
                                            label="Slow query threshold"
                                            name="dbMonitor.slowQueryThreshold"
                                            validate={_.get(model, 'dbMonitor.status', false) ? 'required,gte:0' : null}
                                            description="All DB queries above this response time will be logged. Note: response time is defined in milliseconds."/>
                                    </Ui.Grid.Col>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer align="right">
                            <Ui.Button type="primary" onClick={form.submit} label="Save settings"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Settings>
        );
    }
};


export default SettingsForm;
