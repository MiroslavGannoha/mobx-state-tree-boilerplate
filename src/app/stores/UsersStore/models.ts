import { types } from 'mobx-state-tree';
import { CRUDItem } from 'app/models/Base';
import { DocTypes } from 'app/constants';

export const User = CRUDItem
    .named('User')
    .props({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: types.enumeration('Gender', ['Male', 'Female']),
        email: types.string,
        documentType: DocTypes.User,
    })
    .views((self) => ({
        get fullName () {
            let fullName = '';
            if (self.firstName) { fullName += self.firstName; }
            if (self.middleName) { fullName += ' ' + self.middleName; }
            if (self.lastName) { fullName += ' ' + self.lastName; }
        
            return fullName;
        }
    }));