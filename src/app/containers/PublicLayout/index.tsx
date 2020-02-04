import * as React from 'react';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Spinner from 'app/components/Spinner';

const PublicLayout = ({children}) => (
    <div className="app">
        <React.Suspense fallback={<Spinner />}>
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </React.Suspense>
    </div>
);

export default PublicLayout;
