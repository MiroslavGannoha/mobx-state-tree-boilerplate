import { types, flow } from 'mobx-state-tree';

const AsyncStore = types
    .model('AsyncStore', {
        loading: false,
        error: types.maybeNull(types.string),
    })
    .actions((self) => ({
        storeAsyncCall: flow(function*(asyncCall, ...args) {
            let response: unknown = null;
            self.loading = true;
            try {
                response = yield asyncCall(...args);
                self.error = null;
                return response;
            } catch (error) {
                self.error = error.message;
                console.warn(error.message);
                throw error;
            } finally {
                self.loading = false;
            }
        }),
    }));

export default AsyncStore;
