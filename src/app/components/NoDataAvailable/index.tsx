import * as React from 'react';
import { Alert, Card, CardBody } from 'reactstrap';

interface IProps extends React.HTMLAttributes<HTMLElement> {
    message?: string;
}
export const NoDataAvailable = ({ message, ...otherProps }: IProps) => (
    <Alert className="bg-white" color="white" {...otherProps}>
        <i className="fas fa-info-circle mr-2" />
        {message || 'No Record Found'}
    </Alert>
);

export const NoDataAvailableInCard = () => (
    <Card>
        <CardBody>
            <NoDataAvailable />
        </CardBody>
    </Card>
);
