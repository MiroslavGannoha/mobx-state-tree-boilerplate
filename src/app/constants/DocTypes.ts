import { types, Instance } from 'mobx-state-tree';

export const DocumentTypeEnum = types.enumeration('DocumentType', [
    'User',
    'Question',
    'QuestionnaireQuestion',
]);

export type IDocumentTypeEnum = Instance<typeof DocumentTypeEnum>;

export const DocTypes: Readonly<{ [P in IDocumentTypeEnum]: IDocumentTypeEnum }> = {
    User: 'User',
    Question: 'Question',
    QuestionnaireQuestion: 'QuestionnaireQuestion',
};
