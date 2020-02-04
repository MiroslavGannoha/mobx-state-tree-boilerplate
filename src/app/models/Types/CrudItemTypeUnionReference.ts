import { types, IAnyStateTreeNode, getRoot } from 'mobx-state-tree';
import { CrudItemTypeUnion } from 'app/stores';

export const CrudItemTypeUnionReference = (collectionName?: string) =>
    types.maybeNull(
        types.reference(
            types.late(() => CrudItemTypeUnion),
            {
                get(identifier: string, parent: IAnyStateTreeNode /*Store*/) {
                    const collection = collectionName
                        ? getRoot(parent).collections.get(collectionName)
                        : parent.mainStore.collection;
                    if (!collection) {
                        throw new Error('Collection not found in CrudItemTypeUnionReference');
                    }

                    let targetItem = collection.getItem(identifier);

                    if (!targetItem) {
                        targetItem = CrudItemTypeUnion.create({ id: identifier, documentType: collection.name });
                        collection.saveItem(targetItem);
                        targetItem.fetch();
                    }

                    return targetItem;
                },
                set(value) {
                    return value.id;
                },
            },
        ),
    );
