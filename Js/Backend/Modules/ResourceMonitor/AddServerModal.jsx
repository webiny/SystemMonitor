import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class AddServerModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Form, Grid, Input, Select, Logic, Button} = this.props;
        return (
            <Modal.Dialog>
                <Form api="/entities/system-monitor/servers" onSubmitSuccess={() => {
                    this.props.loadServers();
                    this.hide();
                }}>
                    {(model, container) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header title="Add server to monitor"/>
                            <Modal.Body>
                                <Grid.Row>
                                    <Grid.Col all={12}>
                                        <Input label="Server name" name="name" validate="required"/>
                                        <Select name="type" label="Server type" validate="required" placeholder="Server type">
                                            <option value="web">Web server</option>
                                            <option value="other">Other</option>
                                        </Select>
                                        <Logic.Hide if={_.get(model, 'type') !== 'web'}>
                                            <Input
                                                label="Heartbeat URL"
                                                name="heartbeat"
                                                validate="required,url"
                                                description="This URL will be requested to see if server is alive. Provide a URL that does not require authentication."/>
                                        </Logic.Hide>
                                    </Grid.Col>
                                </Grid.Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="secondary" label="Close" onClick={this.hide}/>
                                <Button type="primary" label="Add" onClick={container.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(AddServerModal, {modules: ['Modal', 'Form', 'Grid', 'Input', 'Select', 'Logic', 'Button']});