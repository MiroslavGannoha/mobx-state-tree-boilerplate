import * as React from 'react';
import { inject, observer } from 'mobx-react';
import BootstrapTable from 'react-bootstrap-table-next';
import { IRootStore } from '../../stores';
import { Button } from 'reactstrap';
import { RoleRestriction } from '../../components/RoleRestriction';
import TableViewDecorator, { ITableViewDecoratorProps } from 'app/decorators/CRUD/TableViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import { dateRender, publishedRender, RowActionsDD } from 'app/components/Table';
import FormattedMsg, { tableHeaderMsg } from '../../components/i18n/FormattedMsg';
import ViewHeader from 'app/components/ViewHeader';
import FiltersBar from 'app/components/FiltersBar';
import { withRouter } from 'react-router';

@inject(({ questionnairesStore }: IRootStore) => ({ store: questionnairesStore }))
@TableViewDecorator
@withRouter
@observer
class Questionnaires extends React.Component<ITableViewDecoratorProps> {

    public columns: unknown[] = [{
        dataField: 'name',
        text: tableHeaderMsg('name'),
        sort: true,
    }, {
        dataField: 'questionnaireType',
        text: tableHeaderMsg('type'),
        formatter: (val) => this.props.specsStore.findLabelByValue('Questionnaire/questionnaireType', val),
        sort: true,
    }, {
        dataField: 'status',
        text: tableHeaderMsg('status'),
        formatter: (val) => this.props.specsStore.findLabelByValue('Questionnaire/status', val),
        sort: true,
    }, {
        dataField: 'published',
        text: tableHeaderMsg('published'),
        formatter: publishedRender,
        sort: true,
    }, {
        dataField: 'modified',
        text: tableHeaderMsg('last-modified'),
        formatter: dateRender,
        sort: true,
    }, {
        dataField: 'id',
        text: tableHeaderMsg('actions'),
        formatter: (id, item) => {
            const {getRowActionsArray} = this.props;
            const rowActionsArrayDefault = getRowActionsArray(item);
            let rowActionsArray = [rowActionsArrayDefault[0]];
            if(item.questionnaireType === 1) {
                rowActionsArray = [
                    ...rowActionsArray,
                    {
                        action: () => {
                            const {store: {detailsStore}, history} = this.props;
                            detailsStore.setItem(id);
                            history.push(detailsStore.itemPath + '/builder');
                        },
                        name: <span><i className="fas fa-boxes" />Builder</span>,
                    },
                    rowActionsArrayDefault[1],
                    {
                        action: () => 1/* this.props.store.togglePublish(item) */,
                        name: <span><i className="fas fa-eye" />Publish</span>,
                    },
                    {
                        action: () => 1/* this.props.store.togglePublish(item) */,
                        name: <span><i className="far fa-clone" />Duplicate</span>,
                    },
                    rowActionsArrayDefault[2],
                ];
            }


            return <RowActionsDD actions={rowActionsArray} rowData={item} />;
        },
        dataAlign: 'center',
        headerStyle: { width: '70px' },
    }];

    public render() {
        const { create, tableProps, store, filtersButtonsGroup } = this.props;

        return (
            <ViewContainer>
                <ViewHeader titleKey="questionnaires" iconClass="fas fa-scroll">
                    <RoleRestriction allowedRoles={['Staff']}>
                        <Button color="primary" onClick={create}>
                            <i className="fa fa-plus mr-2" />
                            <FormattedMsg id="add" />
                        </Button>
                    </RoleRestriction>
                </ViewHeader>
                <FiltersBar store={store}>
                    {filtersButtonsGroup}
                </FiltersBar>
                <BootstrapTable {...tableProps} columns={this.columns} />
            </ViewContainer>
        );
    }
}
export default Questionnaires;
