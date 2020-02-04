import * as React from 'react';
import Spinner from '../../components/Spinner';
import overlayFactory from 'react-bootstrap-table2-overlay';

const overlayStyles = {
    overlay: (base) => ({
        ...base,
        background: 'rgba(27, 44, 88, 0.2)',
        marginTop: 'auto !important',
        height: '100% !important',
    }),
};

export const getTableDefaultProps = (isDataLoading: boolean) => ({
    keyField: 'id',
    remote: true,
    data: [],
    wrapperClasses: 'react-bs-table-primary react-bs-table-selectable',
    bordered: false,
    loading: isDataLoading,
    noDataIndication: () => isDataLoading ? <div style={{ height: 400 }} /> : (
        'No Records Found'
    ),
    overlay: overlayFactory({
        spinner: <Spinner message="Loading table data ..." />,
        styles: overlayStyles,
    }),
    bootstrap4: true,
});

export const getRemoteTableDefaultProps = (isDataLoading: boolean) => ({
    ...getTableDefaultProps(isDataLoading),
    remote: true,
    loading: isDataLoading,
    overlay: overlayFactory({
        spinner: <Spinner message="Loading table data ..."/>,
        styles: overlayStyles,
    }),
    bootstrap4: true,
});

        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
