import { ItemsStoreBase } from 'app/models/Base';
import { Instance } from 'mobx-state-tree';

export * from './models';

export const UsersStore = ItemsStoreBase
    .named('UsersStore');

export default UsersStore;

export type IUsersStore = Instance<typeof UsersStore>;
