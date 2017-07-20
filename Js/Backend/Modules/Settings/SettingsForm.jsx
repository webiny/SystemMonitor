import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';

class SettingsForm extends Webiny.Ui.View {

}

SettingsForm.defaultProps = {
    renderer() {
        const {Settings, View, Tabs, Grid, Switch, Input, Button} = this.props;
        return (
            <Settings api="/entities/system-monitor/settings">
                {(model, form) => (
                    <View.Form>
                        <View.Header
                            title="System Monitor Settings"
                            description="Set your system monitor settings here"/>
                        <View.Body noPadding>
                            <Tabs size="large">
                                <Tabs.Tab label="API Monitor" icon="fa-rocket">
                                    <Grid.Col all={6}>
                                        <Switch
                                            label="API monitor"
                                            name="apiMonitor.status"
                                            description="Turn API monitor on or off"/>
                                        <Input
                                            label="Slow log threshold"
                                            name="apiMonitor.slowLogThreshold"
                                            validate={_.get(model, 'apiMonitor.status', false) ? 'required,gte:0' : null}
                                            description="All API responses above this response time will be logged to the slow log. Note: response time is defined in milliseconds."/>
                                    </Grid.Col>
                                </Tabs.Tab>
                                <Tabs.Tab label="Database Monitor" icon="fa-database">
                                    <Grid.Col all={6}>
                                        <Switch
                                            label="Database monitor"
                                            name="dbMonitor.status"
                                            description="Turn DB monitor on or off"/>
                                        <Input
                                            label="Slow query threshold"
                                            name="dbMonitor.slowQueryThreshold"
                                            validate={_.get(model, 'dbMonitor.status', false) ? 'required,gte:0' : null}
                                            description="All DB queries above this response time will be logged. Note: response time is defined in milliseconds."/>
                                    </Grid.Col>
                                </Tabs.Tab>
                            </Tabs>
                        </View.Body>
                        <View.Footer align="right">
                            <Button type="primary" onClick={form.submit} label="Save settings"/>
                        </View.Footer>
                    </View.Form>
                )}
            </Settings>
        );
    }
};


export default Webiny.createComponent(SettingsForm, {modules: ['Settings', 'View', 'Tabs', 'Grid', 'Switch', 'Input', 'Button']});
