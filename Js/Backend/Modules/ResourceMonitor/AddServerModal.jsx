import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class AddServerModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Form api="/entities/system-monitor/servers" onSubmitSuccess={() => {this.props.loadServers(); this.hide();}}>
                    {(model, container) => (
                        <wrapper>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title="Add server to monitor"/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Server name" name="name" validate="required"/>
                                        <Ui.Select name="type" label="Server type" validate="required" placeholder="Server type">
                                            <option value="web">Web server</option>
                                            <option value="other">Other</option>
                                        </Ui.Select>
                                        <Ui.Logic.Hide if={_.get(model, 'type') !== 'web'}>
                                            <Ui.Input
                                                label="Heartbeat URL"
                                                name="heartbeat"
                                                validate="required,url"
                                                description="This URL will be requested to see if server is alive. Provide a URL that does not require authentication."/>
                                        </Ui.Logic.Hide>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button type="secondary" label="Close" onClick={this.hide}/>
                                <Ui.Button type="primary" label="Add" onClick={container.submit}/>
                            </Ui.Modal.Footer>
                        </wrapper>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

export default AddServerModal;