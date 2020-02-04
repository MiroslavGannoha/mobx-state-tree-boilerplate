import * as React from 'react';
import { inject, observer } from 'mobx-react';
import BootstrapTable from 'react-bootstrap-table-next';
import { IRootStore } from '../../stores';
import { Button } from 'reactstrap';
import { RoleRestriction } from '../../components/RoleRestriction';
import TableViewDecorator, { ITableViewDecoratorProps } from 'app/decorators/CRUD/TableViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import { dateTimeRender } from 'app/components/Table';
import FormattedMsg, { tableHeaderMsg } from '../../components/i18n/FormattedMsg';
import ViewHeader from 'app/components/ViewHeader';
import FiltersBar from 'app/components/FiltersBar';
import { inputTypes } from 'app/constants/questionnaire';

@inject(({ questionsStore }: IRootStore) => ({ store: questionsStore}))
@TableViewDecorator
@observer
class Questions extends React.Component<ITableViewDecoratorProps> {

    public columns = [{
        dataField: 'titleDefault',
        text: tableHeaderMsg('title'),
        sort: true,
    }, {
        dataField: 'displayType',
        text: tableHeaderMsg('type'),
        formatter: (displayType) => inputTypes[displayType],
        sort: true,
    }, {
        dataField: 'modified',
        text: tableHeaderMsg('last-modified'),
        formatter: dateTimeRender,
        sort: true,
    }, {
        dataField: 'id',
        text: 'actions',
        formatter: this.props.getRowActions,
        headerStyle: { width: 70 },
    }];

    public render() {
        const { create, tableProps, store } = this.props;
        return (
            <ViewContainer>
                <ViewHeader titleKey="questions" iconClass="far fa-question-circle" >
                    <RoleRestriction allowedRoles={['Staff']}>
                        <Button color="primary" onClick={create}>
                            <i className="fa fa-plus mr-2" />
                            <FormattedMsg id="add" />
                        </Button>
                    </RoleRestriction>
                </ViewHeader>
                <FiltersBar store={store} />
                <BootstrapTable {...tableProps} columns={this.columns} />
            </ViewContainer>
        );
    }
}
export default Questions;
