import { flow, Instance } from 'mobx-state-tree';
import { SingleItemStoreBase } from '../Base';

export const DetailsStore = SingleItemStoreBase
    .named('DetailsStore')
    .actions((self) => ({
        removeItem: flow(function* () {
            self.loading = true;
            try {
                yield self.item.remove();
                self.error = null;
            } catch (error) {
                // self.error = error.message; - error should not hide the view
                console.warn(error.message);
                throw error;
            } finally {
                self.loading = false;
            }
        }),
    }))
    .views((self) => ({
        get itemPathDetails (): string {
            return self.itemPath;
        },
    }));

export type IDetailsStore = Instance<typeof DetailsStore>;

export const DetailsStorePublishable = DetailsStore
    .named('DetailsStorePublishable')
    .props({
        loadingPublish: false,
        // item: types.maybe(types.reference(types.late(() => PublishableCRUDItemTypeUnion))),
    })
    .actions((self) => ({
        togglePublish: flow(function*() {
            self.loadingPublish = true;
            try {
                yield self.item.togglePublish();
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.loadingPublish = false;
            }
        }),
    }));
