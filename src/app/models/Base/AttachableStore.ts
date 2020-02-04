import {
    types, flow, applySnapshot, getParent, Instance, getEnv,
} from 'mobx-state-tree';
import { CrudItemTypeUnion } from 'app/stores';
import { Collection } from './Collection';
import { values, keys } from 'mobx';

export const AttachableItemsStore = types
    .model('AttachableItemsStore', {
        loading: false,
        error: types.optional(types.maybeNull(types.string), null),
        apiName: types.maybe(types.string),
        attachApiName: types.string,
    })
    .views((self) => ({
        get parent(): any {
            return getParent(self);
        },
    }))
    .views((self) => ({
        get attachApi(): any {
            return self.apiName ?
                getEnv(self).api[self.apiName][self.attachApiName] :
                self.parent.api[self.attachApiName];
        },
    }))
    .actions((self) => ({
        attach: flow(function*(reqData?) {
            self.loading = true;
            try {
                const responseItem = yield self.attachApi.attach(self.parent.item.id, reqData);
                applySnapshot(self.parent.item, responseItem);
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.loading = false;
            }
        }),
    }));

export type IAttachableItemsStore = Instance<typeof AttachableItemsStore>;

export const AttachableFetchableItemsStore = AttachableItemsStore
    .named('AttachableFetchableItemsStore')
    .props({
        items: types.array(types.reference(types.late(() => CrudItemTypeUnion))),
        collection: types.reference(types.late(() => Collection)),
        attachApiName: types.string,
    })
    .views((self) => ({
        get parent(): any {
            return getParent(self);
        },
        get itemsArray() {
            const itemsArray = [...values(self.collection.items)];
            if (typeof itemsArray[0].sortOrder === 'number') {
                itemsArray.sort((a, b) => b.sortOrder - a.sortOrder);
            }

            return itemsArray;
        },
        get itemsKeys() {
            return keys(self.collection.items);
        },
    }))
    .views((self) => ({
        get attachApi(): any {
            return self.apiName ?
                getEnv(self).api[self.apiName][self.attachApiName] :
                self.parent.api[self.attachApiName];
        },
        get item() {
            const parent: any = getParent(self);
            return parent.item;
        },
    }))
    .actions((self) => ({
        fetch: flow(function*() {
            self.loading = true;
            let phasesSteps = null;
            try {
                phasesSteps = yield self.attachApi.fetch(self.parent.item.id);
                phasesSteps.forEach(self.collection.saveItem);
                applySnapshot(self.items, phasesSteps.map(({ id }) => id));
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.loading = false;
            }

            return phasesSteps;
        }),
        attach: flow(function*(reqData) {
            self.loading = true;
            // const reqData = self.items.map((phase) => {
            //     const steps = phase.steps.map((step) => ({ ...step }));
            //     return { ...phase, ...{ steps } };
            // });
            try {
                yield self.attachApi.attach(self.item.id, reqData);
                // applySnapshot(self.item, legalService);
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.loading = false;
            }
        }),
    }));
