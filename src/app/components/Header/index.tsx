import * as React from 'react';
import { Nav, NavbarToggler, NavbarBrand, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { History } from 'history';
import { useRoutes } from 'app/RoutesContext';

interface IProps {
    history?: History;
}

const MainMenuNavItem = ({ viewKey, path, displayLabel }) => {
    return (
        <Nav className="d-sm-down-none font-weight-boldy" navbar>
            <NavItem className="px-3">
                {/* <ViewLink path={path} viewKey={viewKey} className="nav-link" displayLabel={displayLabel} /> */}
            </NavItem>
        </Nav>
    );
};

const MainMenuViews = observer(({ mainMenuViews }) => {
    const routes = useRoutes();
    return mainMenuViews.map(({ key, id, displayLabel }) => {
        const routeFound = routes.find(({ viewKey }) => viewKey === key);
        return (
            <MainMenuNavItem
                {...{ viewKey: key, id, path: routeFound ? routeFound.path : '/no-route' }}
                key={id}
                displayLabel={displayLabel}
            />
        );
    });
});

@observer
class Header extends React.Component<IProps> {
    public render() {

        return (
            <header className="app-header navbar shadow-sm">
                <NavbarToggler className="d-md-none" onClick={this.mobileSidebarToggle}>
                    <span className="navbar-toggler-icon" />
                </NavbarToggler>
                <NavbarToggler className="d-sm-down-none" onClick={this.sidebarToggle}>
                    <span className="navbar-toggler-icon" />
                </NavbarToggler>
                <NavbarBrand tag="div" className="mr-4">
                    <Link className="navbar-logo-link" to="/dashboard">
                        {/* <img alt="" className="navbar-logo navbar-brand-minimized" src={miniLogo} /> */}
                    </Link>
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                    {/* <NavbarToggler
                        className={layoutStore.sidebarActive ? 'text-warning' : 'text-muted'}
                        onClick={layoutStore.toggleSidebar}
                    >
                        <i className="icon-settings" />
                    </NavbarToggler> */}
                </Nav>
            </header>
        );
        // Last header item, bring back later
        // <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
        //     <span className="navbar-toggler-icon" />
        // </NavbarToggler>
    }

    public sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    private sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    private mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    // private asideToggle(e) {
    //     e.preventDefault();
    //     document.body.classList.toggle('aside-menu-hidden');
    // }
}

export default Header;
