import { types, IJsonPatch, applyPatch, applySnapshot } from 'mobx-state-tree';

const PatchUtils = types
    .model('PatchUtils')
    .actions((self) => ({
        patchData(data: obj) {
            const patchData: IJsonPatch[] = Object.entries(data).map(([name, value]) => ({
                op: 'replace',
                path: '/' + name,
                value,
            }));
            applyPatch(self, patchData);
        },
        applyPatch(patch: IJsonPatch) {
            applyPatch(self, patch);
        },
        applySnapshot(snapshot) {
            applySnapshot(self, snapshot);
        },
        patchOnChange(name) {
            return (value) => applyPatch(self, { op: 'replace', path: '/' + name, value });
        },
    }));

export default PatchUtils;
