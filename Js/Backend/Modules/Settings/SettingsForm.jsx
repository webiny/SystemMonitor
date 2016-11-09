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
                                <Ui.Form.Fieldset title="Api Monitor"/>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Switch
                                        label="Api monitor"
                                        name="settings.apiMonitor.status"
                                        validate="required"
                                        description="Turn Api monitor on or off"/>
                                    <Ui.Input
                                        label="Slow log threshold"
                                        name="settings.apiMonitor.slowLogThreshold"
                                        validate="required"
                                        description="All API responses above this response time will be logged to the slow log. Note: response time is defined in milliseconds."/>
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
