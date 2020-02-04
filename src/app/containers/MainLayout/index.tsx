import * as React from 'react';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { SpinnerWithDelay } from 'app/components/Spinner';

// const Header = React.lazy(() => import('../../components/Header'));
// const DynamicSidebar = React.lazy(() => import('app/components/DynamicSidebar'));
// const Breadcrumb = React.lazy(() => import('../../components/Breadcrumb'));
import Footer from 'app/components/Footer';
import { Container, Row, Col } from 'reactstrap';

const MainLayout = ({children}) => (
        <>
            <Row tag="header" className="sticky-top">
                <Col>
                    Header
                </Col>
            </Row>
            <Container fluid={true}>
                    <React.Suspense fallback={<SpinnerWithDelay />}>
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </React.Suspense>
            </Container>
            <footer>
                <Row>
                    <Col>
                        Footer
                    </Col>
                </Row>
            </footer>
        </>
);

export default MainLayout;
