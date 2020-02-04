import * as React from 'react';
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
} from 'reactstrap';

export interface IRowAction {
    name: any;
    action: (rowData: any) => void;
    hide?: boolean;
}

export interface IRowActionsDDProps {
    actions: IRowAction[];
    className?: string;
    rowData?: any;
}

const dropdownToggle = (e) => { e.stopPropagation(); };

export const RowActionsDD = (props: IRowActionsDDProps) => {

    const dropdownItems = props.actions.map(({ name, action, hide }: IRowAction, i) => {
        if (!hide) {
            const rowAction = (e) => {
                e.stopPropagation();
                action(props.rowData);
            };
            return <DropdownItem key={i} onClick={rowAction}>{name}</DropdownItem>;
        }
    });
    const visibleActions = props.actions.filter(({hide}) => !hide);

    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <UncontrolledDropdown className={`d-inline-block ${props.className}`}>
            <DropdownToggle
                color="primary"
                outline
                className="borderless actions-toggle"
                onClick={dropdownToggle}
            >
                <i className="fas fa-ellipsis-h font-xl align-bottom" />
            </DropdownToggle>
            <DropdownMenu>
                {dropdownItems}
            </DropdownMenu>
        </UncontrolledDropdown>
    );
};
