import * as React from 'react';
import { Button, ButtonProps } from 'reactstrap';

interface IProps extends ButtonProps {
    loading: boolean;
    children: React.ReactNode;
}

export class LoadingButton extends React.Component<IProps> {
    public render() {

        const { loading, children, disabled, ...restProps } = this.props;
        const spinnerIcon = (
            <i className={'fas fa-sync-alt ml-2 fa-spin'} />
        );

        return (
            <Button
                {...restProps}
                disabled={loading || disabled}
            >
                {loading ? <>{children}{spinnerIcon}</> : children}
            </Button>
        );
    }
}
