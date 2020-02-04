import { types, getRoot, IAnyStateTreeNode, getPropertyMembers } from 'mobx-state-tree';

export const AsyncReference = (Type) => types.maybeNull(
    types.reference(types.late(() => Type), {
        get(identifier: string, parent: IAnyStateTreeNode /*Store*/) {
            const typeName = getPropertyMembers(Type).name;
            if (!identifier) {
                console.warn(`ID is empty for type - "${typeName}" in node - ${parent}`);
                return null;
            }

            const rootStore = getRoot(parent);
            const collection = rootStore.collections.get(typeName);
            if (!collection) { throw new Error('Collection not found for: ' + typeName); }

            let targetItem = collection.getItem(identifier);

            if (!targetItem) {
                try {
                    targetItem = Type.create({ id: identifier, documentType: typeName });
                    collection.saveItem(targetItem);
                    targetItem.fetch();
                } catch (error) {
                    console.error(error.message);
                }
            }

            return targetItem;
        },
        set(value) {
            return value.id;
        },
    }),
);
