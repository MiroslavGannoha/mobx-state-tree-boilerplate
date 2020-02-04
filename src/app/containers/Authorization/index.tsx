import * as React from 'react';
import { AuthStore } from '../../stores';
import { observer } from 'mobx-react';
import Page401 from '../../views/Page401';
import { Role } from '../../constants/roles';
import RestrictedClient from '../../views/RestrictedClient';
import { SpinnerInCard } from 'app/components/Spinner';

// Authorization HOC
const Authorization = (allowedRoles: Role[]) => ((WrappedComponent): React.ComponentClass => {
    @observer
    class WithAuthorization extends React.Component {
        public render() {
            const {currentPersonaRoles: personaRoles, personaIncludesSomeRoles, isLoggedIn} = AuthStore.getInstance();

            if (!isLoggedIn) {
                return <SpinnerInCard/>;
            }

            if (isLoggedIn && !personaRoles) {
                return <Page401 />;
            }

            if (!personaRoles.includes('Staff')) {
                return <RestrictedClient />;
            }

            if (allowedRoles && !personaIncludesSomeRoles(allowedRoles)) {
                return <Page401 goBackLink={true} />;
            }

            return <WrappedComponent {...this.props} />;
        }
    }

    return WithAuthorization;
});

export default Authorization;
