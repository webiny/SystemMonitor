import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const reasonProps = {
            name: 'trigger',
            placeholder: 'Alarm trigger',
            options: {
                cpu: 'CPU reaches',
                memory: 'Memory reaches',
                disk: 'Disk reaches',
                load: 'Last 15 min load reaches'
            }
        };

        return (
            <Ui.Modal.Dialog>
                <Ui.Settings id="system-monitor" api="/entities/system-monitor/settings" onSubmitSuccess={this.hide}>
                    {(model, container) => (
                        <wrapper>
                            <Ui.Form.Loader container={container}/>
                            <Ui.Modal.Header title="System Monitor Alarms"/>
                            <Ui.Modal.Body>
                                <Ui.Alert type="info">
                                    Recurring alarms will only send a notification once every 15 minutes.
                                </Ui.Alert>
                                <Ui.Form.Fieldset title="Alarms"/>
                                <Ui.Dynamic.Fieldset name="settings.alarms">
                                    <Ui.Dynamic.Row>
                                        {function (record, actions) {
                                            return (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={5}>
                                                        <Ui.Select {...reasonProps} validate="required"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={4}>
                                                        <Ui.Input placeholder="Treshold" name="treshold" validate="required"/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}>
                                                        <div className="btn-group">
                                                            <Ui.Button type="primary" label="Add" onClick={actions.add(record)}/>
                                                            <Ui.Button type="secondary" label="x" onClick={actions.remove(record)}/>
                                                        </div>
                                                    </Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            );
                                        }}
                                    </Ui.Dynamic.Row>
                                    <Ui.Dynamic.Empty>
                                        {function (actions) {
                                            return (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={12}>
                                                        <h5>You have not yet created any alarms. Start by clicking "Add alarm"!</h5>
                                                        <Ui.Button type="primary" label="Add alarm" onClick={actions.add()}/>
                                                    </Ui.Grid.Col>
                                                </Ui.Grid.Row>
                                            )
                                        }}
                                    </Ui.Dynamic.Empty>
                                </Ui.Dynamic.Fieldset>

                                <Ui.Form.Fieldset title="Notifications"/>
                                <Ui.Grid.Row>
                                    <Ui.Checkbox label="Send message to Slack" grid={12} name="settings.slack"/>
                                    <Ui.Logic.Hide if={!_.get(model.settings, 'slack')}>
                                        <Ui.Grid.Col all={10} xsOffset={1}>
                                            <Ui.Input
                                                label="Slack Token"
                                                name="settings.token"
                                                validate="required"
                                                description={<span>Bot token to use when sending notifications. <a target="_blank" href="https://api.slack.com/bot-users">Create your Slack bot here.</a></span>}/>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Input label="Team" name="settings.team" validate="required"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Input label="Channel" name="settings.channel" validate="required"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={4}>
                                                    <Ui.Input label="Username" name="settings.username" validate="required"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                        </Ui.Grid.Col>
                                    </Ui.Logic.Hide>
                                    <Ui.Checkbox label="Send email" grid={12} name="settings.email"/>
                                    <Ui.Logic.Hide if={!_.get(model.settings, 'email')}>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={10} xsOffset={1}>
                                                <Ui.Input label="Emails" name="settings.emails" validate="required"/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    </Ui.Logic.Hide>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button type="secondary" label="Close" onClick={this.hide}/>
                                <Ui.Button type="primary" label="Save" onClick={container.submit}/>
                            </Ui.Modal.Footer>
                        </wrapper>
                    )}
                </Ui.Settings>
            </Ui.Modal.Dialog>
        );
    }
}

export default SettingsModal;