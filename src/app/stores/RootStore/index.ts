import api from 'app/api';
import UsersStore from '../UsersStore';
import { RootStore } from './models';
import { DocTypes } from 'app/constants';
import { castToSnapshot } from 'mobx-state-tree';
export * from './models';
export * from './CrudItemTypeUnion';
export * from './Context';

export function createStores() {
    const rootStore = RootStore.create(
        {
            collections: {},
            usersStore: castToSnapshot(UsersStore.create({ collection: DocTypes.User })),
        },
        {
            api,
        },
    );

    window.rootStore = rootStore;

    return rootStore;
}
