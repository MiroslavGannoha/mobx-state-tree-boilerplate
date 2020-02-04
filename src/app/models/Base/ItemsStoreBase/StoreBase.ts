import { types, resolveIdentifier, getRoot, applySnapshot, applyPatch } from 'mobx-state-tree';
import { CrudItemTypeUnion, ICrudItemTypeUnion } from 'app/stores';
import { values } from 'mobx';
import { IParams } from 'app/api/Utils';
import AsyncStore from '../AsyncStore';
import { CollectionStore } from '../CollectionStore';
import PatchUtils from '../PatchUtils';

export const StoreBase = types
    .compose(
        CollectionStore,
        AsyncStore,
        PatchUtils,
    )
    .named('StoreBase')
    .views((self) => ({
        get root(): unknown {
            return getRoot(self);
        },
        get itemsArray(): ICrudItemTypeUnion[] {
            return [...values(self.collection.items)];
        },
        get allFetched(): boolean {
            return self.collection.allFetched;
        },
    }))
    .actions((self) => ({
        setLoading: (isLoading: boolean) => self.loading = isLoading,
        findItemById: (id) => id ? resolveIdentifier(CrudItemTypeUnion, self.collection, id) : null,
        fetchItem: (id: string, params?: IParams) => {
            if (!id) {
                throw new Error('No ID given');
            }
            const newItem = CrudItemTypeUnion.create({ id, documentType: self.collection.name });
            self.collection.saveItem(newItem);
            return self.storeAsyncCall(newItem.fetch, params)
                .then(() => newItem)
                .catch((e) => {
                    newItem.destroy();
                    throw e;
                });
        },
        fetchAll: (params?: IParams) => self.storeAsyncCall(self.collection.fetchAll, params),
        fetchAllOnce: (params?: IParams) => {
            if (!self.allFetched) {
                self.storeAsyncCall(self.collection.fetchAll, params);
            }
        },
        fetchAllCached: (params?: IParams) => {
            const cachedItems = localStorage.getItem(self.collection.name);
            if (cachedItems) {
                applySnapshot(self.collection.items, JSON.parse(cachedItems));
                applyPatch(self.collection, {path: '/allFetched', value: true, op: 'replace'});
            } else {
                self.storeAsyncCall(self.collection.fetchAll, params);
            }
        }
    }));
