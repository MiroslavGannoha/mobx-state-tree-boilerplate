import { flow } from 'mobx-state-tree';
import { SingleItemStoreBase } from '../Base';

export const CreateStore = SingleItemStoreBase
    .named('CreateStore')
    .actions((self) => ({
        createItem: flow(function*(itemData) {
            const response = yield self.storeAsyncCall(self.api.create, itemData);
            self.mainStore.collection.saveItem(response);
            return self.setItem(response.id);
        }),
    }))
    .views((self) => ({
        get itemPathCreate (): string {
            return self.itemPath;
        },
    }));
