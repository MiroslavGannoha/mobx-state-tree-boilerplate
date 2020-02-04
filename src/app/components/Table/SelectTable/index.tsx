import * as React from 'react';
import { observer } from 'mobx-react';
import { Input } from 'reactstrap';
import { getTableDefaultProps } from '../defaults';
import BootstrapTable from 'react-bootstrap-table-next';

export interface ISelectTableProps {
    items: unknown;
    columns: unknown[];
    tableLoading: boolean;
    onSelect: (selectedItems: unknown[]) => void;
    selected: unknown[];
}

const SelectTable = observer((props: ISelectTableProps) => {
    const { items, columns, tableLoading = false, onSelect, selected, ...otherProps } = props;
    const onChange = (event) => event;
    const selectTableProps: unknown = {
        ...getTableDefaultProps(tableLoading),
        remote: false,
        data: items,
        columns,
        selectRow: {
            mode: 'checkbox',
            clickToExpand: true,
            clickToSelect: false,
            selectionHeaderRenderer: ({ mode, rowIndex, indeterminate, ...restProps }) => (
                <div className="custom-control custom-checkbox">
                    <Input
                        type={mode}
                        className="custom-control-input"
                        id={rowIndex + '-id-h'}
                        indeterminate={String(indeterminate)}
                        onChange={onChange}
                        {...restProps}
                    />
                    <label className="custom-control-label" />
                </div>
            ),
            selectionRenderer: ({ mode, rowIndex, indeterminate, ...restProps }) => (
                <div className="custom-control custom-checkbox">
                    <Input
                        type={mode}
                        className="custom-control-input"
                        id={rowIndex + '-id'}
                        indeterminate={String(indeterminate)}
                        onChange={onChange}
                        {...restProps}
                    />
                    <label className="custom-control-label" />
                </div>
            ),
            selected,  // give a array which contain the row key you want to select.
            onSelect: (row, isSelect, rowIndex, e) => {
                onSelect(isSelect ? [...selected, row.id] : selected.filter((x) => x !== row.id));
            },
            onSelectAll: (isSelect, rows) => {
                onSelect(isSelect ? rows.map((r) => r.id) : []);
            },
        },
    };

    return <BootstrapTable {...selectTableProps} {...otherProps} />;
});

export default SelectTable;
