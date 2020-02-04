import serverMock from '../ServerMock';

export * from './CRUDAPI';

export interface IParams {
    [k: string]: string | number | undefined | null;
}
export interface ISearchParams extends IParams {
    searchText?: string;
    orderBy?: string;
}
export interface IPagedSearchParams extends ISearchParams {
    itemsPerPage: number;
    pageNumber: number;
}
type queryMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';

// server fetch mock
const apiQuery = (method: queryMethods, path: string, params: any = null) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const targetResource = serverMock[path];
            switch(method) {
                case 'get': {
                    if (params.id) {
                        const foundItem = targetResource.find((id) => id === params.id);
                        foundItem ? resolve(foundItem) : reject(foundItem);
                    } else {
                        resolve(targetResource);
                    }
                }
                case 'post': {
                    targetResource.push(params);
                    resolve(targetResource[targetResource.length - 1]);
                }
                case 'put': {
                    const index = targetResource.findIndex((id) => id === params.id);
                    if (index > -1) {
                        targetResource[index] = params;
                        resolve(targetResource[index]);
                    } else {
                        reject('Item not found');
                    }          
                };
                case 'patch': {
                    const index = targetResource.findIndex((id) => id === params.id);
                    if (index > -1) {
                        targetResource[index] = {...targetResource[index], ...params};
                        resolve(targetResource[index]);
                    } else {
                        reject('Item not found');
                    }          
                };
                case 'delete': {
                    const index = targetResource.findIndex((id) => id === params.id);
                    if (index > -1) {
                        delete targetResource[index];
                        resolve(targetResource);
                    } else {
                        reject('Item not found');
                    }          
                };
            }
            resolve();
        }, 1000);
    });

export default apiQuery;
