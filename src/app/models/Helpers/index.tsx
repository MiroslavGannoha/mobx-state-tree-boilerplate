import { types } from 'mobx-state-tree';

export const Paging = types
    .model('Paging', {
        itemsPerPage: types.integer,
        pageNumber: types.integer,
        searchText: '',
        orderBy: '',
    });
