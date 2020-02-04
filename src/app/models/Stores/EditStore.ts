import { SnapshotIn, applySnapshot, decorate } from 'mobx-state-tree';
import { CrudItemTypeUnion } from 'app/stores';
import { SingleItemStoreBase } from '../Base';
import atomic from 'app/middlewares/atomic';

export const EditStore = SingleItemStoreBase.named('EditStore')
    .actions((self) => ({
        editItem: decorate(
            atomic,
            (itemData: SnapshotIn<typeof CrudItemTypeUnion>) => {
                applySnapshot(self.item, { ...self.item, ...itemData });
                return self.storeAsyncCall(self.item.sync);
            },
        ),
    }))
    .views((self) => ({
        get itemPathEdit (): string {
            return self.itemPath + '/edit';
        },
    }));
