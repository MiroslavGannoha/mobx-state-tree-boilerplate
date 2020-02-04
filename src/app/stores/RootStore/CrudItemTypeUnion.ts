import { User } from '../UsersStore';
import { DocTypes } from 'app/constants';
import { types, Instance } from 'mobx-state-tree';

export const CrudItemTypeUnion = types.union(
    {
        dispatcher(snapshot) {
            switch (snapshot.documentType) {
            case DocTypes.User:
                return User;
            default:
                throw new Error(`CRUDItemTypeUnion.ts - Model type not found - ${snapshot.documentType}`);
            }
        },
    },
    User
);

export type ICrudItemTypeUnion = Instance<typeof CrudItemTypeUnion>;