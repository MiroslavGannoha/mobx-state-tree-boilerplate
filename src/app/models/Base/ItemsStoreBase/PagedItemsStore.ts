import { types, flow, applySnapshot } from 'mobx-state-tree';
import { CrudItemTypeUnion } from 'app/stores';
import { Paging } from '../../Helpers';
import { TotalStore } from './TotalStore';
import { StoreBase } from './StoreBase';

const defaultPagingParams = {
    itemsPerPage: 15,
    pageNumber: 1,
    searchText: '',
    orderBy: '',
};

export const PagedItemsStoreBase = types
    .model('PagedItemsStoreBase', {
        pagedItems: types.array(types.safeReference(types.late(() => CrudItemTypeUnion))),
        pagingParams: types.optional(Paging, defaultPagingParams),
        pagedFilter: types.maybe(types.string),
    })
    .views(() => ({
        get pagedFilters() {
            // define locally
            throw new Error('Paged filters are not set');
        },
        get countFilters() {
            // define locally
            throw new Error('Count filters are not set');
        },
        get filtersParams() {
            return null;
        },
    }))
    .actions((self) => ({
        setPagedFilter: (filter: string) => {
            self.pagedFilter = filter;
        },
        setPagingParams: ({ itemsPerPage, pageNumber, orderBy }) => {
            // 0 - don't change
            if (itemsPerPage > 0) {
                self.pagingParams.itemsPerPage = itemsPerPage;
            }

            if (pageNumber > 0) {
                self.pagingParams.pageNumber = pageNumber;
            }

            if (orderBy) {
                self.pagingParams.orderBy = orderBy;
            }
        },
        setSearchText: (searchText: string) => {
            self.pagingParams.searchText = searchText;
        },
    }));

export const PagedItemsStore = types
    .compose(PagedItemsStoreBase, TotalStore, StoreBase)
    .actions((self) => ({
        pagedCall(params) {
            const call = self.pagedFilter ? self.pagedFilters[self.pagedFilter] : self.api.getAllPaged;
            if (!call) {
                throw new Error('Filter or endpoint not found!');
            }
            const finalParams =
                self.filtersParams && self.filtersParams[self.pagedFilter]
                    ? { ...params, ...self.filtersParams[self.pagedFilter] }
                    : params;
            return () => call(finalParams);
        },
        totalCall(params) {
            const call = self.pagedFilter ? self.countFilters[self.pagedFilter] : self.api.totalCount;
            const finalParams =
                self.filtersParams && self.filtersParams[self.pagedFilter]
                    ? { ...params, ...self.filtersParams[self.pagedFilter] }
                    : params;
            return () => call(finalParams);
        },
    }))
    .actions((self) => ({
        fetchPaged: () => {
            return self.storeAsyncCall(() =>
                self
                    .pagedCall(self.pagingParams)()
                    .then((response) => {
                        if (!response) {
                            throw new Error('No data');
                        }
                        applySnapshot(self.pagedItems, response.map(self.collection.saveItem));
                        return response;
                    }),
            );
        },
        fetchTotal: flow(function *() {
            self.totalLoading = true;
            try {
                const totalCount: number = yield self.totalCall({ searchText: self.pagingParams.searchText })();
                self.total = totalCount;
            } catch (error) {
                console.warn(error.message);
            } finally {
                self.totalLoading = false;
            }
        }),
    }))
    .actions((self) => ({
        refresh: () => {
            self.fetchPaged();
            self.fetchTotal();
        },
    }));
