import { ItemsStoreBase } from 'app/models/Base';
import { Instance, types } from 'mobx-state-tree';
import { QuestionBase } from './models';

export * from './models';

export const QuestionsStore = ItemsStoreBase
    .named('QuestionsStore')
    .props({
        draftItems: types.array(QuestionBase),
    });

export default QuestionsStore;

export type IQuestionsStore = Instance<typeof QuestionsStore>;
