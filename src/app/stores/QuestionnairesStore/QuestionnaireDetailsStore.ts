import { DetailsStore } from 'app/models/Stores';
import { types, getParent, flow, applySnapshot } from 'mobx-state-tree';
import PatchUtils from 'app/models/Base/PatchUtils';
import { StoreBase } from 'app/models/Base';
import { documentTypes } from 'app/constants/documentTypes';
import { QuestionnaireQuestionBase } from './models';
import { IParams } from 'app/api/Utils';

export const QuestionnaireQuestionsStore = types
    .compose(StoreBase, PatchUtils)
    .named('QuestionnaireDetailsStore')
    .props({
        questions: types.array(QuestionnaireQuestionBase),
    })
    .views((self) => ({
        get questionnaireId () {
            return getParent(self).item.id;
        },
    }))
    .actions((self) => ({
        fetchAll: flow(function*(params?: IParams) {
            const response = yield self.storeAsyncCall(self.api.getAll, params);
            applySnapshot(self.questions, response.sort((a, b) => a.sortOrder - b.sortOrder));
            return response;
        }),
    }));

export const QuestionnaireDetailsStore = DetailsStore
    .named('QuestionnaireDetailsStore')
    .props({
        questionnaireQuestionsStore: types.optional(QuestionnaireQuestionsStore, {
            collection: documentTypes.QuestionnaireQuestion,
        }),
    });
