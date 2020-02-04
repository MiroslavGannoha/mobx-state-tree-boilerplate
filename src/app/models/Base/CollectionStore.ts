import { types } from 'mobx-state-tree';
import { ICRUDAPIGENERAL } from 'app/api/Utils';
import { Collection } from './Collection';

export const CollectionStore = types
    .model('CollectionStore', {
        collection: types.reference(types.late(() => Collection)),
    })
    .views((self) => ({
        get api(): ICRUDAPIGENERAL {
            return self.collection.api;
        },
    }));
