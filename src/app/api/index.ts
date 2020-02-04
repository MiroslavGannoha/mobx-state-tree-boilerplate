export * from './users';

import * as apis from './';
import { IDocumentTypeEnum } from 'app/constants';
import { ICRUDAPIGENERAL } from './Utils';

const api: { [P in IDocumentTypeEnum]: ICRUDAPIGENERAL } = {
    User: apis.usersApi,
};

export default api;
