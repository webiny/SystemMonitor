import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

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

        return (
            <Ui.View.List>
                <Ui.View.Header
                    title="DB Monitor"
                    description="This dashboard shows DB query details.">
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List {...listProps}>
                        <Ui.List.FormFilters>
                            {(applyFilters, resetFilters) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Select {...collectionList} onChange={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={3}>
                                        <Ui.Select {...operationList} onChange={applyFilters()}/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={2} className="pull-right">
                                        <Ui.Button type="secondary" align="right" label="Reset Filters" onClick={resetFilters()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>

                        <Table>
                            <Table.Row>
                                <Table.RowDetailsField/>
                                <Table.DateTimeField name="ts" align="center" label="Executed At" sort="ts" format="YYYY-MM-DD HH:mm:ss"/>
                                <Table.Field name="ns" align="center" label="Namespace"/>
                                <Table.Field name="op" align="center" label="Operation"/>
                                <Table.Field name="docsExamined" align="center" label="Docs Examined" sort="docsExamined"/>
                                <Table.Field name="nreturned" align="center" label="Docs Returned"/>
                                <Table.Field name="keysExamined" align="center" label="Keys Examined"/>
                                <Table.Field name="millis" align="center" label="Execution Time" sort="millis"/>
                            </Table.Row>
                            <Table.RowDetails>
                                {(data) => {
                                    return (
                                        <Ui.CodeHighlight language="javascript">{JSON.stringify(data, null, 2)}</Ui.CodeHighlight>
                                    );
                                }}
                            </Table.RowDetails>
                        </Table>
                        <Ui.List.Pagination/>
                    </Ui.List>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default Dashboard;