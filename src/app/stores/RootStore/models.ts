import { History } from 'history';
import { UsersStore } from '../UsersStore';
import { types, destroy, getEnv, Instance, detach } from 'mobx-state-tree';
import { Collection } from 'app/models/Base';
import { DocTypes } from 'app/constants';


export const RootStore = types
    .model('RootStore', {
        collections: types.map(Collection),
        usersStore: types.late(() => UsersStore),
    })
    .actions((self) => ({
        initCollections: () => {
            Object.values(DocTypes).forEach((documentType) => {
                const collection = Collection.create({ name: documentType, items: {} });
                self.collections.put(collection);
            });
        },
        saveToCollection: (item) => {
            if (item) {
                return self.collections?.get(item.documentType)?.saveItem(item);
            }
        },
        destroyItem: (item) => {
            destroy(item);
        },
        detachItem: (item) => {
            detach(item);
        },
    }))
    .actions((self) => ({
        afterCreate() {
            self.initCollections();
        },
    }))
    .views((self) => ({
        get history(): History {
            return getEnv(self).history;
        },
    }));

export type IRootStore = Instance<typeof RootStore>;
