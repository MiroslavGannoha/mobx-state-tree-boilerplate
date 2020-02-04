import { types, Instance } from 'mobx-state-tree';
import { CRUDItem, CRUDItemBase } from 'app/models/Base';
import { documentTypes } from 'app/constants/documentTypes';
import { Persona } from '../PersonasStore/models';
import { MSTForm } from 'app/models/MSTForm';
import { OptionList } from '../OptionListStore';
import { QuestionBase, Question } from '../QuestionsStore';
import { AwaitReference } from 'app/models/Types';

const FormIdModel = types
    .model('FormIdModel', {
        formId: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        sortOrder: types.optional(types.integer, 0),
        page: types.optional(types.integer, 0),
    });

const QuestionOptionListOption = types
    .model('QuestionOptionListOption', {
        name: types.maybeNull(types.string),
        formIds: types.array(FormIdModel),
        questions: types.array(types.string),
    });

export const QuestionOptionList = types
    .model('QuestionOptionList', {
        optionListId: AwaitReference(OptionList),
        valueMapId: types.maybeNull(types.string),
        options: types.map(QuestionOptionListOption),
    })
    .views((self) => ({
        get id () {
            return self.optionListId?.id;
        },
    }));

export const QuestionnaireQuestionBase = types
    .compose(
        QuestionBase,
        CRUDItemBase,
        MSTForm,
    )
    .named('QuestionnaireQuestionBase')
    .props({
        questionnaireId: types.maybeNull(types.string),
        questionId: AwaitReference(Question),
        page: types.optional(types.integer, 0),
        part: types.maybeNull(types.string),
        section: types.maybeNull(types.string),
        questionNumber: types.maybeNull(types.string),
        optionList: types.maybeNull(QuestionOptionList),
        formIds: types.array(FormIdModel),
        questionnaireObjectType: types.optional(types.integer, 0),
        showAdditionalInfo: false,
        canAddAdditionalInformation: false,
        multiTextBoxQuestions: types.array(types.string),
        answers: types.array(types.string),
        additionalInformation: types.maybeNull(types.string),
        // questionlanguages: types.array(QuestionLanguage),
        documentType: 'QuestionnaireQuestion',
    })
    .actions((self) => ({
        afterCreate: () => {
            if(!self.optionList) {
                self.optionList = QuestionOptionList.create({});
            }
        },
    }))
    .preProcessSnapshot(({ page, answers, questionlanguages, ...otherProps }) => ({
        page: page ? page : 0,
        answers: !answers ? [] : answers.filter((a) => a),
        questionLanguages: questionlanguages,
        ...otherProps,
    }));

export const QuestionnaireQuestion = types
    .compose(
        QuestionnaireQuestionBase,
        CRUDItem,
    )
    .named('QuestionnaireQuestion');

export const Questionnaire = CRUDItem
    .named(documentTypes.Questionnaire)
    .props({
        // questionnaireIds: types.array(AwaitReference(Questionnaire)),
        template: false,
        name: types.maybeNull(types.string),
        published: false,
        isAutoNumbering: false,
        questionnaireType: types.optional(types.integer, 0),
        personaId: AwaitReference(Persona),
        status: types.optional(types.integer, 0),
        filledByStaff: false,
        filledBy: types.maybeNull(types.string),
        sentToClient: types.maybeNull(types.string),
        documentType: documentTypes.Questionnaire,
    });

export type IQuestionnaire = Instance<typeof Questionnaire>;
export type IQuestionnaireQuestion = Instance<typeof QuestionnaireQuestion>;
export type IQuestionnaireQuestionBase = Instance<typeof QuestionnaireQuestionBase>;
