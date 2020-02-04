import * as React from 'react';
import { Card, CardBody, Col, Row, Container } from 'reactstrap';

interface IProps {
    message?: string;
    className?: string;
    style?: unknown;
}

const Spinner = (props: IProps) => (
    <div className={'sk-custom-spinner ' + props.className} {...props}>
        <div className="sk-folding-cube selected">
            <div className="sk-cube1 sk-cube" />
            <div className="sk-cube2 sk-cube" />
            <div className="sk-cube4 sk-cube" />
            <div className="sk-cube3 sk-cube" />
        </div>
        {props.message || 'Loading'}
    </div>
);

export const inlineSpinner = <i className="fas fa-sync-alt fa-spin" />;
export const CardBlockSpinner = () => (
    <div
        className="d-flex justify-content-center align-items-center bg-warning"
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
        }}
    >
        <i className="fas fa-sync-alt fa-spin text-primary font-size-xl" />
    </div>
);

interface ISpinnerInCardProps extends IProps {
    containerClass?: string;
}
export const SpinnerInCard = ({ containerClass, ...otherProps }: ISpinnerInCardProps) => (
    <Card className={`shadow-sm ${containerClass ? containerClass : ''}`}>
        <CardBody>
            <Spinner {...otherProps} />
        </CardBody>
    </Card>
);

export const SpinnerInRow = (props: IProps) => (
    <Row>
        <Col className="text-center">
            <Spinner {...props} />
        </Col>
    </Row>
);

interface ISpinnerWrapperProps extends IProps {
    isLoading: boolean;
    children: React.ReactElement<unknown>;
}

export const SpinnerWrapper = (props: ISpinnerWrapperProps) => {
    const { isLoading, children, ...restProps } = props;
    return isLoading ? <SpinnerInCard {...restProps} /> : children;
};

export const SpinnerFullscreen = (props: IProps) => (
    <div className="app flex-row align-items-center">
        <Container>
            <Row className="justify-content-center">
                <Col md="6">
                    <Spinner {...props} />
                </Col>
            </Row>
        </Container>
    </div>
);

export const SpinnerWithDelay = (props: { delay?: number } & IProps) => {
    const { delay, ...spinnerProps } = props;
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, delay || 200);
        return () => clearTimeout(timeout);
    }, []);

    if (!show) {
        return null;
    }

    return <Spinner {...spinnerProps} />;
};

export default Spinner;
