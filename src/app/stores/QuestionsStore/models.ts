import { CRUDItem, CRUDItemBase } from 'app/models/Base';
import { DocTypes } from 'app/constants';
import { types, Instance } from 'mobx-state-tree';
import { MSTForm } from 'app/models/MSTForm';
import { AwaitReference } from 'app/models/Types';
import { Language } from '../LanguagesStore';

const GroupQuestion = types
    .model('GroupQuestion', {
        id: '',
        isHidden: false,
    });

export const QuestionLanguage = MSTForm
    .named('QuestionLanguage')
    .props({
        languageId: AwaitReference(Language),
        language: types.maybeNull(types.string),
        title: types.maybeNull(types.string),
        placeholder: types.maybeNull(types.string),
        instruction: types.maybeNull(types.string),
    });

export const QuestionBase = types
    .compose(
        CRUDItemBase,
        MSTForm,
    )
    .named('QuestionBase')
    .props({
        correctAnswer: types.maybeNull(types.string),
        displayType: types.optional(types.integer, 1),
        inputFormat: types.maybeNull(types.optional(types.integer, 1)),
        lines: types.optional(types.integer, 0),
        maxLength: types.optional(types.integer, 0),
        isRequired: false,
        mask: types.maybeNull(types.string),
        sortOrder: types.optional(types.integer, 0),
        questionLanguages: types.array(QuestionLanguage),
        isGroup: false,
        groupQuestions: types.array(GroupQuestion),
        documentType: DocTypes.Question,
    })
    .views((self) => ({
        get titleDefault() {
            if(self.questionLanguages && self.questionLanguages.length) {
                const defaultLangaugeItem = self.questionLanguages.find(({languageId}) => languageId.isDefault);
                if (defaultLangaugeItem) {
                    return defaultLangaugeItem.title;
                } else {
                    return self.questionLanguages[0].title;
                }
            }
            return 'No Title';
        },
    }))
    .preProcessSnapshot(({ lines, maxLength, questionLanguages, groupQuestions, ...otherProps }) => ({
        lines: lines === null ? 0 : lines,
        maxLength: maxLength === null ? 0 : maxLength,
        questionLanguages: !questionLanguages ? [] : questionLanguages,
        groupQuestions: !groupQuestions ? [] : groupQuestions,
        ...otherProps,
    }));

export const Question = types
    .compose(
        QuestionBase,
        CRUDItem,
    )
    .named(DocTypes.Question)
    .props({
        documentType: DocTypes.Question,
    });


export type IQuestion = Instance<typeof Question>;
export type IQuestionBase = Instance<typeof QuestionBase>;
