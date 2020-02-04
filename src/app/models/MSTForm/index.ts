import { applyPatch, Instance, applySnapshot, getSnapshot, resolvePath } from 'mobx-state-tree';
import { observable } from 'mobx';
import PatchUtils from '../Base/PatchUtils';

export const MSTForm = PatchUtils
    .named('MSTForm')
    // .props({})
    .volatile(() => ({
        errorsShown: false,
        invalidPaths: observable(new Set()),
        resetState: null,
    }))
    .views((self) => ({
        get isValid() {
            return !self.invalidPaths.size;
        },
        isPathInvalid(path) {
            return self.invalidPaths.has(path);
        },
        pathValue(path) {
            return resolvePath(self, path);
        },
    }))
    .actions((self) => ({
        updateInvalidPath(path, isInvalid) {
            isInvalid ? self.invalidPaths.add(path) : self.invalidPaths.delete(path);
        },
        showErrors() {
            self.errorsShown = true;
        },
        hideErrors() {
            self.errorsShown = false;
        },
        patchPath(path: string, value) {
            applyPatch(self, { op: 'replace', path, value });
        },
        reset() {
            applySnapshot(self, self.resetState);
            self.errorsShown = false;
            self.invalidPaths.clear();
        },
        saveState() {
            self.resetState = getSnapshot(self);
        },
        afterCreate() {
            self.resetState = getSnapshot(self);
        },
        onFormValid() {
            throw new Error('onFormValid not set on form');
        },
    }))
    .actions((self) => ({
        submit() {
            return new Promise((resolve, reject) => {
                if (self.isValid) {
                    resolve(getSnapshot(self));
                } else {
                    reject(`Form "${self.$treenode.type.name}" - is not valid`);
                    self.showErrors();
                }
            });
        },
    }));

export type IMSTForm = Instance<typeof MSTForm>;
export interface IMSTFormGeneral extends IMSTForm {
    [x: string]: unknown;
}
