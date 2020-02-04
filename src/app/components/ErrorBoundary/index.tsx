import * as React from 'react';
import { toast } from 'react-toastify';
import { Alert } from 'reactstrap';

interface IState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component {

    public static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public state: IState = {
        hasError: false,
    };

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    public componentDidCatch(error, info) {
        console.log('Internal App Error:');
        console.log(error);
        console.log(info);
        toast.error('Internal App Error');
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Alert color="danger">
                    <h1>Error occured.</h1>
                </Alert>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
