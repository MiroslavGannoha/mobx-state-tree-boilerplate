import * as React from 'react';
import { getRemoteTableDefaultProps, IRowAction, RowActionsDD } from 'app/components/Table';
import { toast } from 'react-toastify';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { Button, ButtonGroup } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';

export const useTableView = (store, history) => {
    const { loading, total } = store;

    React.useEffect(() => {
        if (!store.pagedItems.length) {
            store.fetchPaged();
            store.fetchTotal();
        }
    }, []);

    const refresh = () => {
        store.fetchPaged();
        store.fetchTotal();
    };

    const create = () => {
        history.push(store.createStore.itemPathCreate);
    };

    const details = ({id}) => {
        store.detailsStore.setItem(id);
        history.push(store.detailsStore.itemPathDetails);
    };

    const edit = ({id}) => {
        store.editStore.setItem(id);
        history.push(store.editStore.itemPathEdit);
    };

    const deleteItem = ({id}) => {
        const item = store.findItemById(id);
        store.removeItem(item)
            .then(store.refresh)
            .then(() => {
                item.destroy();
                toast.success('Successfully deleted');
            });
    };

    const getRowActionsArray = (item) => {
        const rowActions: IRowAction[] = [
            {
                action: () => details(item),
                name: <span><i className="fa fa-info mr-2" />View</span>,
            },
            {
                action: () => edit(item),
                name: <span><i className="far fa-edit mr-2" />Edit</span>,
            },
            {
                action: () => deleteItem(item),
                name: <span className="text-danger"><i className="far fa-trash-alt mr-2" />Delete</span>,
            },
        ];

        return rowActions;
    };

    const getRowActions = (row, item) => {
        return <RowActionsDD actions={getRowActionsArray(item)} rowData={row} />;
    };

    const setFilter = (filter) => {
        return () => {
            const prevSnapshot = getSnapshot(store);
            store.setPagedFilter(filter);
            store.setPagingParams({itemsPerPage: 0, pageNumber: 1});
            store.fetchPaged().catch(() => {
                toast.error('Failed to fetch filter data');
                applySnapshot(store, prevSnapshot);
            });
            store.fetchTotal();
        };
    };

    const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
        const pagingParams = {
            pageNumber: page,
            itemsPerPage: sizePerPage,
        };

        if (sortField && sortOrder) {
            pagingParams.orderBy = `${sortField} ${sortOrder}`;
        }

        store.setPagingParams(pagingParams);
        store.fetchPaged();
    };

    const rowEvents = {
        onClick: (e, item) => details(item),
    };

    const { pageNumber, itemsPerPage } = store.pagingParams;

    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => {
        const optionsList = options.map((option) => {
            const isSelect = currSizePerPage === `${option.page}`;
            const onClick = () => onSizePerPageChange(option.page);
            return (
                <Button
                    color="primary"
                    key={option.text}
                    onClick={onClick}
                    className={isSelect ? 'active' : ''}
                >
                    {option.text}
                </Button>
            );
        });

        return (
            <ButtonGroup>
                {optionsList}
            </ButtonGroup>
        );
    };

    const tableProps = {
        ...getRemoteTableDefaultProps(loading),
        ...{
            data: [...store.pagedItems],
            rowEvents,
            onTableChange,
            pagination: paginationFactory({
                page: pageNumber,
                sizePerPage: itemsPerPage,
                totalSize: total,
                sizePerPageList: [15, 20, 40],
                sizePerPageRenderer,
            }),
        },
    };

    const refreshButton = (
        <Button
            color="primary"
            disabled={loading}
            onClick={refresh}
        >
            <i className={'fas fa-sync-alt' + (loading ? ' fa-spin' : '')} />
        </Button>
    );

    let filtersButtonsGroup;
    if (store.pagedFilter) {
        const filterButtons = Object.keys(store.pagedFilters).map((filterName) => (
            <Button
                key={filterName}
                color="primary"
                className={store.pagedFilter === filterName ? 'active' : ''}
                onClick={setFilter(filterName)}
            >
                {filterName}
            </Button>
        ));

        filtersButtonsGroup = (
            <ButtonGroup>
                {filterButtons}
            </ButtonGroup>
        );
    }

    const actions = {
        deleteItem,
        create,
        tableProps,
        refreshButton,
        filtersButtonsGroup,
        getRowActions,
        getRowActionsArray,
    };

    return actions;
};
