import Webiny from 'Webiny';

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
            placeholder: 'Filter by namespace',
            allowClear: true,
            api: '/services/system-monitor/db-profiles',
            url: '/namespaces',
            minimumResultsForSearch: 5
        };

        const operationList = {
            name: 'op',
            placeholder: 'Filter by operation',
            allowClear: true,
            options: {
                query: 'Query',
                insert: 'Insert',
                update: 'Update',
                remove: 'Remove',
                command: 'Command'
            }
        };

        const {View, Grid, List, Select, Button, CodeHighlight} = this.props;

        return (
            <View.List>
                <View.Header
                    title="DB Monitor"
                    description="This dashboard shows DB query details.">
                </View.Header>
                <View.Body>
                    <List {...listProps}>
                        <List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Grid.Row>
                                    <Grid.Col all={4}>
                                        <Select {...collectionList} onChange={applyFilters()}/>
                                    </Grid.Col>
                                    <Grid.Col all={4}>
                                        <Select {...operationList} onChange={applyFilters()}/>
                                    </Grid.Col>
                                    <Grid.Col all={2} className="pull-right">
                                        <Button type="secondary" align="right" label="Reset Filters" onClick={resetFilters()}/>
                                    </Grid.Col>
                                </Grid.Row>
                            )}
                        </List.FormFilters>

                        <List.Table>
                            <List.Table.Row>
                                <List.Table.RowDetailsField/>
                                <List.Table.DateTimeField name="ts" align="center" label="Executed At" sort="ts" format="YYYY-MM-DD HH:mm:ss"/>
                                <List.Table.Field name="ns" align="center" label="Namespace"/>
                                <List.Table.Field name="op" align="center" label="Operation"/>
                                <List.Table.Field name="docsExamined" align="center" label="Docs Examined" sort="docsExamined"/>
                                <List.Table.Field name="nreturned" align="center" label="Docs Returned"/>
                                <List.Table.Field name="keysExamined" align="center" label="Keys Examined"/>
                                <List.Table.Field name="millis" align="center" label="Execution Time" sort="millis"/>
                            </List.Table.Row>
                            <List.Table.RowDetails>
                                {(data) => {
                                    return (
                                        <CodeHighlight language="javascript">{JSON.stringify(data, null, 2)}</CodeHighlight>
                                    );
                                }}
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