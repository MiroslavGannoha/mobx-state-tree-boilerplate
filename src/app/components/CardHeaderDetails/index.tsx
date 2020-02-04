import * as React from 'react';
import { dateTimeRender } from '../Table';
import { CardHeader, Row, Col } from 'reactstrap';

interface IProps {
    created: string;
    className?: string;
    modified: string;
    children?: React.ReactNodeArray;
}

const CardHeaderDetails = ({ created, modified, className, children }: IProps) => (
    <CardHeader className={`bg-white ${className}`}>
        <Row className="justify-content-between">
            <Col sm="auto" className="text-muted">
                <span className="mr-4">
                    <i className="far fa-plus-square mr-2" />
                    {dateTimeRender(created)}
                </span>
                <span>
                    <i className="far fa-edit mr-2" />
                    {dateTimeRender(modified)}
                </span>
            </Col>
            <Col sm="auto">
                {children}
            </Col>
        </Row>
    </CardHeader>
);

export default CardHeaderDetails;
