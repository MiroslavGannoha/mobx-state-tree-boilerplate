import * as React from 'react';
import { observer } from 'mobx-react';
import { IRouterStore, ILayoutStore, useRootStore } from 'app/stores';
import { Route } from 'react-router';
import { SpinnerInCard } from '../Spinner';
import ErrorBoundary from '../ErrorBoundary';
import Page403 from 'app/views/Page403';

interface IProps {
    layoutStore?: ILayoutStore;
    routerStore?: IRouterStore;
    computedMatch?: unknown;
    path: string;
    component: React.ComponentClass | React.FunctionComponent;
    viewKey: string;
    exact: boolean;
    store?: unknown;
}

const RouteView = observer((routeProps: IProps) => {
    const {
        path, exact, viewKey, store,
        component: Component,
    } = routeProps;

    const { layoutStore, routerStore } = useRootStore();

    if (layoutStore.loading) {
        return <SpinnerInCard/>;
    }

    const render = (props) => {
        routerStore.setMatch(props.match);
        if (layoutStore.userViews.has(viewKey)) {
            layoutStore.setActiveViewKey(viewKey);
            return (
                <Component {...props} store={store} viewKey={viewKey} />
            );
        } else {
            return (
                <Page403 />
            );
        }
    };

    return (
        <ErrorBoundary>
            <Route
                exact={exact}
                path={path}
                render={render}
                strict={true}
            />
        </ErrorBoundary>
    );
});

export default RouteView;
