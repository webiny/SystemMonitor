import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace SystemMonitor.Backend.DbMonitor.Dashboard
 */
class Dashboard extends Webiny.Ui.View {
    constructor(props) {
        super(props);
    }
}

Dashboard.defaultProps = {
    renderer() {
        const listProps = {
            api: '/services/system-monitor/db-profiles',
            fields: '*',
            sort: '-ts',
            connectToRouter: true,
            perPage: 25
        };

        const collectionList = {
            name: 'ns',
            placeholder: this.i18n('Filter by namespace'),
            allowClear: true,
            api: '/services/system-monitor/db-profiles',
            url: '/namespaces',
            minimumResultsForSearch: 5
        };

        const operationList = {
            name: 'op',
            placeholder: this.i18n('Filter by operation'),
            allowClear: true,
            options: {
                query: this.i18n('Query'),
                insert: this.i18n('Insert'),
                update: this.i18n('Update'),
                remove: this.i18n('Remove'),
                command: this.i18n('Command')
            }
        };

        const {View, Grid, List, Select, Button, CodeHighlight} = this.props;

        return (
            <View.List>
                <View.Header
                    title={this.i18n('DB Monitor')}
                    description={this.i18n('This dashboard shows DB query details.')}>
                </View.Header>
                <View.Body>
                    <List {...listProps}>
                        <List.FormFilters>
                            {({apply, reset}) => (
                                <Grid.Row>
                                    <Grid.Col all={4}>
                                        <Select {...collectionList} onChange={apply()}/>
                                    </Grid.Col>
                                    <Grid.Col all={4}>
                                        <Select {...operationList} onChange={apply()}/>
                                    </Grid.Col>
                                    <Grid.Col all={2} className="pull-right">
                                        <Button type="secondary" align="right" label={this.i18n('Reset Filters')} onClick={reset()}/>
                                    </Grid.Col>
                                </Grid.Row>
                            )}
                        </List.FormFilters>

                        <List.Table>
                            <List.Table.Row>
                                <List.Table.RowDetailsField/>
                                <List.Table.DateTimeField name="ts" align="center" label={this.i18n('Executed At')} sort="ts"
                                                          format="YYYY-MM-DD HH:mm:ss"/>
                                <List.Table.Field name="ns" align="center" label={this.i18n('Namespace')}/>
                                <List.Table.Field name="op" align="center" label={this.i18n('Operation')}/>
                                <List.Table.Field name="docsExamined" align="center" label={this.i18n('Docs Examined')} sort="docsExamined"/>
                                <List.Table.Field name="nreturned" align="center" label={this.i18n('Docs Returned')}/>
                                <List.Table.Field name="keysExamined" align="center" label={this.i18n('Keys Examined')}/>
                                <List.Table.Field name="millis" align="center" label={this.i18n('Execution Time')} sort="millis"/>
                            </List.Table.Row>
                            <List.Table.RowDetails>
                                {({data}) => (
                                    <CodeHighlight language="javascript">{JSON.stringify(data, null, 2)}</CodeHighlight>
                                )}
                            </List.Table.RowDetails>
                        </List.Table>
                        <List.Pagination/>
                    </List>
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(Dashboard, {modules: ['View', 'Grid', 'List', 'Select', 'Button', 'CodeHighlight']});