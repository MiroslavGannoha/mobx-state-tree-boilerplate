import {
    getRoot, applySnapshot, getParent,
} from 'mobx-state-tree';
import AsyncStore from './AsyncStore';
import { CrudItemTypeUnionReference } from '../Types';

export const SingleItemStoreBase = AsyncStore
    .named('SingleItemStoreBase')
    .props({
        item: CrudItemTypeUnionReference(),
    })
    .views((self) => ({
        get mainStore(): any {
            return getParent(self);
        },
    }))
    .views((self) => ({
        get api() {
            return self.mainStore.api;
        },
        get root(): any {
            return getRoot(self);
        },
        get itemPath (): string {
            return self.item
                ? self.mainStore.getItemPath({[self.item.documentType]: self.item.id})
                : self.mainStore.getListPath() + '/create';
        },
    }))
    .actions((self) => ({
        setItem: (itemId: string) => {
            self.item = itemId;
            return self.item;
        },
        setLoading: (isLoading) => {
            self.loading = isLoading;
        },
    }))
    .actions((self) => ({
        // initItem: (id) => {
        //     const resolvedItem: any = self.mainStore.collection.getItem(id);
        //     if (resolvedItem) {
        //         self.setItem(resolvedItem.id);
        //         return resolvedItem;
        //     }

        //     const newItem = CrudItemTypeUnion.create({ id, documentType: self.mainStore.collection.name });
        //     self.mainStore.collection.saveItem(newItem);
        //     try {
        //         self.setItem(newItem.id);
        //         self.storeAsyncCall(newItem.fetch);
        //     } catch (error) {
        //         newItem.destroy();
        //         self.item = undefined;
        //     }

        //     return newItem;
        // },
        reset: () => {
            applySnapshot(self, {loading: false, error: null});
        },
    }));
