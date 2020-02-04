import { ItemsStoreBase } from 'app/models/Base';
import { Instance, types } from 'mobx-state-tree';
import { QuestionnaireDetailsStore } from './QuestionnaireDetailsStore';

export * from './models';

export const QuestionnairesStore = ItemsStoreBase
    .named('QuestionnairesStore')
    .props({
        pagedFilter: 'All',
        detailsStore: types.optional(QuestionnaireDetailsStore, {}),
    })
    .views((self) => ({
        get pagedFilters() {
            return {
                'All': self.api.getAllPaged,
                'Intake Questionnaire': self.api.getAllPaged,
                // 'Form': self.api.getAllPaged,
                'Deleted': self.api.getAllPaged,
            };
        },
        get countFilters() {
            return {
                'All': self.api.totalCount,
                'Intake Questionnaire': self.api.totalCount,
                // 'Form': self.api.totalCount,
                'Deleted': self.api.totalCount,
            };
        },
        get filtersParams() {
            return {
                'All': { filterType: null },
                'Intake Questionnaire': { filterType: 'intake' },
                'Deleted': { filterType: 'deleted' },
            };
        },
    }));

export default QuestionnairesStore;

export type IQuestionnairesStore = Instance<typeof QuestionnairesStore>;