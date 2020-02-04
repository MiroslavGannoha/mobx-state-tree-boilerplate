import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Nav, NavbarBrand } from 'reactstrap';
import { IRootStore, IFirmStore } from 'app/stores';
import logo from '../../../../../img/lp-logo.png';

interface IHeaderProps {
    firmStore?: IFirmStore;
}

@inject(({ firmStore }: IRootStore) => ({ firmStore }))
@observer
class HeaderPublic extends React.Component<IHeaderProps> {

    public render() {
        const {
            firmStore,
        } = this.props;

        return (
            <header className="app-header navbar shadow-sm position-relative">
                <NavbarBrand tag="div">
                    <img
                        className="navbar-logo navbar-brand-full"
                        src={logo}
                    />
                </NavbarBrand>
                <Nav className="d-md-down-none ml-auto" navbar>
                    <a href={firmStore.website} className="nav-link" target="_blank">
                        {firmStore.firmName}
                    </a>
                </Nav>
                <Nav className="ml-auto" navbar />
            </header>
        );
    }

}

export default HeaderPublic;
