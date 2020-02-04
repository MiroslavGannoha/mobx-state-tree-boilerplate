import apiQuery, { IParams, IPagedSearchParams, ISearchParams } from '../Utils';

export interface ICRUDAPIGENERAL extends CRUDAPI {
    [x: string]: any;
}

export class CRUDAPI {
    public servicePath: string | undefined = undefined;
    public serviceName: string | undefined = undefined;

    constructor(servicePath: string, serviceName?: string) {
        if (!servicePath) {
            throw new Error('Service Name not specified!');
        }

        this.servicePath = servicePath;
        this.serviceName = serviceName;
    }

    public getAll = (params?: IParams): Promise<unknown[]> => {
        return this.totalCount(params)
            .then((totalCount) => this.getAllPaged({itemsPerPage: totalCount, pageNumber: 1, ...params}));
    }

    public getAllPaged = (params: IPagedSearchParams):
        Promise<unknown[]> => (
        apiQuery(
            'get',
            `/${this.servicePath}/paged`,
            this.serviceName || this.servicePath,
            params,
        )
    )

    public getRecent = (params?: ISearchParams): Promise<unknown[]> => {
        return this.getAllPaged({itemsPerPage: 5, pageNumber: 1, ...params});
    }

    public get = (itemId: string, params?: IParams): Promise<unknown> => {
        return apiQuery('get', `/${this.servicePath}/${itemId}`, this.serviceName || this.servicePath, params);
    }

    public create = (item): Promise<unknown> => {
        return apiQuery('post', `/${this.servicePath}`, this.serviceName || this.servicePath, item);
    }

    public update = (itemId: string, item): Promise<unknown> => {
        item.id = itemId;
        return apiQuery('put', `/${this.servicePath}`, this.serviceName || this.servicePath, item);
    }

    public patch = (itemId: string, item): Promise<unknown> => {
        return apiQuery('patch', `/${this.servicePath}/${itemId}`, this.serviceName || this.servicePath, item);
    }

    public remove = (itemId: string, item?): Promise<unknown> => {
        return apiQuery('delete', `/${this.servicePath}/${itemId}`, this.serviceName || this.servicePath);
    }

    public totalCount = (params?: ISearchParams): Promise<number> => {
        return apiQuery('get', `/${this.servicePath}/count`, this.serviceName || this.servicePath + ' count', params)
            .then(({ count }) => count);
    }
}
