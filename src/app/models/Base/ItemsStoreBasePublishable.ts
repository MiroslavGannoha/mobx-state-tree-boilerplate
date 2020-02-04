import { ItemsStoreBase } from './ItemsStoreBase';
import { types, castToSnapshot } from 'mobx-state-tree';
import { DetailsStorePublishable } from '../Stores';

export const ItemsStorePublishable = ItemsStoreBase
    .named('ItemsStorePublishable')
    .props({
        detailsStore: types.optional(DetailsStorePublishable, () => castToSnapshot(DetailsStorePublishable.create())),
    })
    .actions((self) => ({
        togglePublish: (item) => self.storeAsyncCall(item.togglePublish),
    }));
