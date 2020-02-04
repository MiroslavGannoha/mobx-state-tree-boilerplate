import { CollectionStore } from '../CollectionStore';
import { flow, Instance } from 'mobx-state-tree';

export const TotalStore = CollectionStore
    .named('TotalStore')
    .props({
        totalLoading: false,
        total: 0,
    })
    .actions((self) => ({
        fetchTotal: flow(function*() {
            const call = self.api.totalCount;
            self.totalLoading = true;

            try {
                const totalCount: number = yield call();
                self.total = totalCount;
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.totalLoading = false;
            }
        }),
    }));

export type ITotalStore = Instance<typeof TotalStore>;
