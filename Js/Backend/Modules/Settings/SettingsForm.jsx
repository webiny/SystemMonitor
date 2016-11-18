import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsForm extends Webiny.Ui.View {

}

SettingsForm.defaultProps = {
    renderer() {
        return (
            <Ui.Settings id="system-monitor" api="/entities/system-monitor/settings">
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header
                            title="System Monitor Settings"
                            description="Set your system monitor settings here"/>
                        <Ui.View.Body>
                            <Ui.Grid.Row>
                                <Ui.Form.Fieldset title="API Monitor"/>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Switch
                                        label="API monitor"
                                        name="settings.apiMonitor.status"
                                        description="Turn API monitor on or off"/>
                                    <Ui.Input
                                        label="Slow log threshold"
                                        name="settings.apiMonitor.slowLogThreshold"
                                        validate={_.get(model, 'settings.apiMonitor.status', false) ? 'required,gte:0' : null}
                                        description="All API responses above this response time will be logged to the slow log. Note: response time is defined in milliseconds."/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>

                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Form.Fieldset title="Database Monitor"/>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Switch
                                        label="Database monitor"
                                        name="settings.dbMonitor.status"
                                        description="Turn DB monitor on or off"/>
                                    <Ui.Input
                                        label="Slow query threshold"
                                        name="settings.dbMonitor.slowQueryThreshold"
                                        validate={_.get(model, 'settings.dbMonitor.status', false) ? 'required,gte:0' : null}
                                        description="All DB queries above this response time will be logged. Note: response time is defined in milliseconds."/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>

                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
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
