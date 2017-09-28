import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace SystemMonitor.Backend.ResourceMonitor.AddServerModal
 */
class AddServerModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Form, Grid, Input, Select, Logic, Button} = this.props;
        return (
            <Modal.Dialog>
                <Form api="/entities/system-monitor/servers" onSubmitSuccess={() => {
                    this.props.loadServers();
                    this.hide();
                }}>
                    {({model, form}) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header title={this.i18n('Add server to monitor')} onClose={this.hide}/>
                            <Modal.Body>
                                <Grid.Row>
                                    <Grid.Col all={12}>
                                        <Input label={this.i18n('Server name')} name="name" validate="required"/>
                                        <Select name="type" label={this.i18n('Server type')} validate="required" placeholder={this.i18n('Server type')}>
                                            <option value="web">{this.i18n('Web server')}</option>
                                            <option value="other">{this.i18n('Other')}</option>
                                        </Select>
                                        <Logic.Hide if={_.get(model, 'type') !== 'web'}>
                                            <Input
                                                label={this.i18n('Heartbeat URL')}
                                                name="heartbeat"
                                                validate="required,url"
                                                description={this.i18n('This URL will be requested to see if server is alive. Provide a URL that does not require authentication.')}/>
                                        </Logic.Hide>
                                    </Grid.Col>
                                </Grid.Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button label={this.i18n('Close')} onClick={this.hide}/>
                                <Button type="primary" label={this.i18n('Add')} onClick={form.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(AddServerModal, {modules: ['Modal', 'Form', 'Grid', 'Input', 'Select', 'Logic', 'Button']});