import {
    types, Instance,
} from 'mobx-state-tree';
import { PagedItemsStore } from './PagedItemsStore';
import { ViewStore } from './ViewStore';
import { IDetailsStore } from 'app/models/Stores';

export * from './PagedItemsStore';
export * from './StoreBase';
export * from './TotalStore';
export * from './ViewStore';

export const ItemsStoreBase = types
    .compose(
        PagedItemsStore,
        ViewStore,
    );

export type IItemsStoreBase = Instance<typeof ItemsStoreBase>;
export interface IItemsStoreBaseGeneral extends IItemsStoreBase {
    [x: string]: unknown;
    detailsStore: IDetailsStore & { [x: string]: unknown; };
}
