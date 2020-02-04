import * as React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import { hot } from 'react-hot-loader/root';
import Spinner from './components/Spinner';
import { RootContainer } from './containers/Root';
import { createBrowserHistory } from 'history';
import { Homepage } from './views/NotesWidget/Homepage';

const MainLayout = React.lazy(() => import('./containers/MainLayout'));
const PublicLayout = React.lazy(() => import('./containers/PublicLayout'));

const isLoggedIn = true;
const MainLayoutRoutes = () => (
    <MainLayout>
        <Switch>
            <Homepage />
        </Switch>
    </MainLayout>
);

const AllAvailableRoutes = observer(() => (
    <PublicLayout>
        <Switch>
            {isLoggedIn ? <Route component={MainLayoutRoutes} /> : <Redirect to="/user-login" />}
        </Switch>
    </PublicLayout>
));

const browserHistory = createBrowserHistory();

const App = observer(({ rootStore }) => {
    return (
        <React.Suspense fallback={<Spinner />}>
            <Provider {...rootStore}>
                <Router history={browserHistory}>
                    <RootContainer>
                        <React.Suspense fallback={<Spinner />}>
                            <AllAvailableRoutes />
                        </React.Suspense>
                    </RootContainer>
                </Router>
            </Provider>
        </React.Suspense>
    );
});

export default hot(App);
