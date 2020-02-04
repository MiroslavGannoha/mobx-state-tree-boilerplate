import { types, flow, applySnapshot, getSnapshot, getEnv, getRoot, IAnyModelType } from 'mobx-state-tree';
import { toast } from 'react-toastify';
import { ICRUDAPIGENERAL, IParams } from 'app/api/Utils';
import PatchUtils from './PatchUtils';

export const Destroyable = types
    .model('Destroyable', {})
    .actions((self) => ({
        destroy: () => {
            const root: IAnyModelType = getRoot(self);
            root.destroyItem(self);
        },
        detach: () => {
            const root: IAnyModelType = getRoot(self);
            root.detachItem(self);
        },
    }));

export const Item = Destroyable
    .named('Item')
    .props({
        created: types.maybe(types.string),
        firmId: types.maybe(types.string),
        id: types.maybe(types.string),
        // id: types.identifier,
        modified: types.maybe(types.string),
        documentType: types.string,
        deleted: false,
        _etag: types.maybeNull(types.maybe(types.string)),
    });

export const APIItem = Item
    .named('APIItem')
    .views((self) => ({
        get api(): ICRUDAPIGENERAL {
            const api = getEnv(self).api[self.documentType];
            if (!api) { throw new Error(`No API found for ${self.documentType}`); }
            return api;
        },
    }));

export const CRUDItemBase = types
    .compose(
        APIItem,
        PatchUtils,
    )
    .named('CRUDItemBase')
    .volatile(() => ({
        fetching: false,
    }))
    .actions((self) => ({
        post: flow(function*() {
            const { id, modified, created, ...body } = getSnapshot(self);
            const response = yield self.api.create(body);
            if(!id || id === response.id) { applySnapshot(self, response); }
            return self;
        }),
        sync: flow(function*() {
            const { id, modified, ...body } = getSnapshot(self);
            if(!id) { throw new Error('ID is not set'); }
            const response = yield self.api.update(id, body);
            applySnapshot(self, response);
            return self;
        }),
        patch: flow(function*(patchData: obj) {
            if(!self.id) { throw new Error('ID is not set'); }
            const { id, firmId, _etag } = self;
            const requestBody = patchData;
            try {
                const { ...response } = yield self.api.patch(id, requestBody);
                applySnapshot(self, { ...getSnapshot(self), ...response });
                return self;
            } catch (error) {
                console.warn(error.message);
                throw error;
            }
        }),
        fetch: flow(function* (params?: IParams) {
            if(!self.id) { throw new Error('ID is not set'); }
            try {
                self.fetching = true;
                const response = yield self.api.get(self.id, params);
                applySnapshot(self, response);
            } catch (error) {
                console.warn(error.message);
                throw error;
            } finally {
                self.fetching = false;
            }
        }),
        remove: flow(function* () {
            if(!self.id) { throw new Error('ID is not set'); }
            const response = yield self.api.remove(self.id, self);
            applySnapshot(self, response);
            return self;
        }),
    }));

export const CRUDItem = CRUDItemBase
    .named('CRUDItem')
    .props({
        id: types.identifier,
    });

export const PublishableCRUDItem = CRUDItem
    .named('PublishableCRUDItem')
    .props({
        publishedDate: types.maybeNull(types.optional(types.string, '')),
    })
    .actions((self) => ({
        togglePublish: flow(function* () {
            try {
                const { _etag: newEtag, ...result } = yield self.publishedDate ?
                    self.api.unpublish(self) :
                    self.api.publish(self);
                applySnapshot(self, result);
            } catch (error) {
                toast.error('Failed to change published status');
                throw error;
            }
            toast.success(self.publishedDate ? 'Published successfully' : 'Unpublished successfully');
        }),
    }));
