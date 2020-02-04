import { types } from 'mobx-state-tree';
import { DetailsStore, EditStore, CreateStore } from '../../Stores';
import { StoreBase } from './StoreBase';
import { generatePath } from 'react-router';

export const ViewStore = StoreBase
    .named('ViewStore')
    .props({
        createStore: types.optional(CreateStore, () => CreateStore.create()),
        editStore: types.optional(EditStore, () => EditStore.create()),
        detailsStore: types.optional(DetailsStore, () => DetailsStore.create()),
    })
    .views((self) => ({
        get basePathPattern (): string {
            return self.collection.name;
        },
    }))
    .actions((self) => ({
        removeItem: (item) => self.storeAsyncCall(item.remove),
        patchItem: (item, data) => self.storeAsyncCall(item.patch, data),
        getListPath(routeParams?: RouteParams, addPath?: string): string {
            return generatePath(self.basePathPattern + (addPath || ''), routeParams);
        },
        getItemPath(routeParams: RouteParams, addPath?: string): string {
            return generatePath(`${self.basePathPattern}/:${self.collection.name + (addPath || '')}`, routeParams);
        },
    }));
