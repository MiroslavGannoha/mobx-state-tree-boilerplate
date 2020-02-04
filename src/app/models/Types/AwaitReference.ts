import { types, getRoot, IAnyStateTreeNode, getPropertyMembers } from 'mobx-state-tree';

export const AwaitReference = (Type) => types.maybeNull(
    types.reference(types.late(() => Type), {
        get(identifier: string, parent: IAnyStateTreeNode /*Store*/) {
            if (!identifier) {
                console.warn(`ID is empty for type - ${Type} in node - ${parent}`);
                return null;
            }
            const rootStore = getRoot(parent);
            const typeName = getPropertyMembers(Type).name;
            
            const collection = rootStore.collections.get(typeName);
            let resolvedItem = collection.getItem(identifier) || null;
            if (!resolvedItem) {
                try {
                    resolvedItem = Type.create({ id: identifier, documentType: typeName });
                    collection.saveItem(resolvedItem);
                } catch (error) {
                    console.error(error.message);
                }

            }

            return resolvedItem;
        },
        set(value) {
            return value.id;
        },
    }),
);