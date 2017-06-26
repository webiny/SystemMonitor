import Webiny from 'Webiny';

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

        const {Modal, Settings, Form, Section, Alert, Dynamic, Grid, Select, Input, Button, Checkbox, Logic} = this.props;

        return (
            <Modal.Dialog>
                <Settings api="/entities/system-monitor/settings" onSubmitSuccess={this.hide}>
                    {(model, container) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header title="System Monitor Alarms"/>
                            <Modal.Body>
                                <Alert type="info">
                                    Recurring alarms will only send a notification once every 15 minutes.
                                </Alert>
                                <Section title="Alarms"/>
                                <Dynamic.Fieldset name="alarms">
                                    <Dynamic.Row>
                                        {(record, actions) => {
                                            return (
                                                <Grid.Row>
                                                    <Grid.Col all={5}>
                                                        <Select {...reasonProps} validate="required"/>
                                                    </Grid.Col>
                                                    <Grid.Col all={4}>
                                                        <Input placeholder="Treshold" name="treshold" validate="required"/>
                                                    </Grid.Col>
                                                    <Grid.Col all={3}>
                                                        <div className="btn-group">
                                                            <Button type="primary" label="Add" onClick={actions.add(record)}/>
                                                            <Button type="secondary" label="x" onClick={actions.remove(record)}/>
                                                        </div>
                                                    </Grid.Col>
                                                </Grid.Row>
                                            );
                                        }}
                                    </Dynamic.Row>
                                    <Dynamic.Empty>
                                        {actions => {
                                            return (
                                                <Grid.Row>
                                                    <Grid.Col all={12}>
                                                        <h5>You have not yet created any alarms. Start by clicking "Add alarm"!</h5>
                                                        <Button type="primary" label="Add alarm" onClick={actions.add()}/>
                                                    </Grid.Col>
                                                </Grid.Row>
                                            );
                                        }}
                                    </Dynamic.Empty>
                                </Dynamic.Fieldset>

                                <Section title="Notifications"/>
                                <Grid.Row>
                                    <Checkbox label="Send message to Slack" name="slack"/>
                                    <Logic.Hide if={!_.get(model.settings, 'slack')}>
                                        <Grid.Col all={10} xsOffset={1}>
                                            <Input
                                                label="Slack Token"
                                                name="token"
                                                validate="required"
                                                description={<span>Bot token to use when sending notifications. <a target="_blank" href="https://api.slack.com/bot-users">Create your Slack bot here.</a></span>}/>
                                            <Grid.Row>
                                                <Grid.Col all={4}>
                                                    <Input label="Team" name="team" validate="required"/>
                                                </Grid.Col>
                                                <Grid.Col all={4}>
                                                    <Input label="Channel" name="channel" validate="required"/>
                                                </Grid.Col>
                                                <Grid.Col all={4}>
                                                    <Input label="Username" name="username" validate="required"/>
                                                </Grid.Col>
                                            </Grid.Row>
                                        </Grid.Col>
                                    </Logic.Hide>
                                    <Checkbox label="Send email" name="email"/>
                                    <Logic.Hide if={!_.get(model.settings, 'email')}>
                                        <Grid.Row>
                                            <Grid.Col all={10} xsOffset={1}>
                                                <Input label="Emails" name="emails" validate="required"/>
                                            </Grid.Col>
                                        </Grid.Row>
                                    </Logic.Hide>
                                </Grid.Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="default" label="Close" onClick={this.hide}/>
                                <Button type="primary" label="Save" onClick={container.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Settings>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(SettingsModal, {
    modules: ['Modal', 'Settings', 'Form', 'Section', 'Alert', 'Dynamic', 'Grid', 'Select', 'Input', 'Button', 'Checkbox', 'Logic']
});