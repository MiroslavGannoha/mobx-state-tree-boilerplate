import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { getTableDefaultProps } from './defaults';

const BSTable = ({loading, ...tableProps}) => {
    const bsTableProps = {
        ...getTableDefaultProps(loading),
        ...tableProps,
    };
    return (
        <BootstrapTable {...bsTableProps} />
    );
};

export default BSTable;