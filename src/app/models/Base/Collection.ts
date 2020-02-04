import { types, getEnv, Instance, flow } from 'mobx-state-tree';
import { CrudItemTypeUnion, ICrudItemTypeUnion } from 'app/stores';
import { ICRUDAPIGENERAL, IParams } from 'app/api/Utils';
import { values } from 'mobx';
import AsyncStore from './AsyncStore';

export const Collection = AsyncStore
    .named('Collection')
    .props({
        name: types.identifier, // IDocumentTypeEnum
        items: types.map(types.late(() => CrudItemTypeUnion)),
        allFetched: false,
    })
    .views((self) => ({
        get api(): ICRUDAPIGENERAL {
            return getEnv(self).api[self.name];
        },
        get itemsArray(): ICrudItemTypeUnion[] {
            return [...values(self.items)];
        },
    }))
    .actions((self) => ({
        saveItem: (item) => {
            return self.items.put(item);
        },
        getItem: (id: string) => {
            return self.items.get(id);
        },
        clearItems: () => self.items.clear(),
    }))
    .actions((self) => ({
        fetchAll: flow(function*(params?: IParams) {
            self.allFetched = true;
            const response = yield self.storeAsyncCall(self.api.getAll, params);
            response.forEach(self.saveItem);
            return response;
        }),
        createItem: flow(function* (itemData) {
            const response = yield self.storeAsyncCall(
                self.api.create,
                itemData,
            );

            return self.saveItem(response);
        }),
        removeItem: (item) => self.storeAsyncCall(item.remove),
        setAllFetched: (isAllFetched: boolean) => {
            self.allFetched = isAllFetched;
        },
    }));

export type ICollection = Instance<typeof Collection>;
