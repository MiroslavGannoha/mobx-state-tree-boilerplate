import * as React from 'react';
import { Route, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import {useRoutes} from 'app/RoutesContext';

const findRouteItem = (targetPath: string) => {
    const foundItem = useRoutes().find(({ path }) => path === targetPath);

    return foundItem;
};

const getPaths = (pathname) => {
    const paths = ['/'];

    if (pathname === '/') {
        return paths;
    }

    pathname.split('/').reduce((prev, curr, index) => {
        const currPath = `${prev}/${curr}`;
        paths.push(currPath);
        return currPath;
    });
    return paths;
};

const BreadcrumbsItem =
inject(({ layoutStore }) => ({ layoutStore }))(
    observer(({ match, layoutStore }: any) => {
        const routeItem: any = findRouteItem(match.path);
        const routeName = routeItem && layoutStore.userViews.has(routeItem.viewKey) ? routeItem.title : null;
        if (routeName) {
            return (
                match.isExact || !routeItem.exact ?
                    (
                        <BreadcrumbItem active={true}>{routeName}</BreadcrumbItem>
                    ) :
                    (
                        <BreadcrumbItem>
                            <Link to={match.url || ''}>
                                {routeName}
                            </Link>
                        </BreadcrumbItem>
                    )
            );
        }

        return null;
    }),
);

const Breadcrumbs = inject(({ routerStore }) => ({ routerStore }))(
    observer(({ routerStore: { match } }: any) => {
        const paths = getPaths(match.path);
        const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem} />);
        return (
            <Breadcrumb className="breadcrumb-container">
                {items}
            </Breadcrumb>
        );
    }),
);

export default (props) => (
    <Route path="/:path" component={Breadcrumbs} {...props} />
);
