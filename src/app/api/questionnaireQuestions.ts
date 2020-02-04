import apiQuery, { IParams, CRUDAPI } from './Utils';

class QuestionnaireQuestionsApi extends CRUDAPI {
    public getAll = (params?: IParams): Promise<unknown[]> => {
        const { questionnaireId, ...otherParams } = params;
        return apiQuery('get', `/questionnaire/${questionnaireId}/questions`, 'questionnaire questions', otherParams);
    };

    public get = (id: string, data): Promise<unknown> => {
        return apiQuery('patch', `/questionnaire/${data.questionnaireId}/questions/${id}`, 'questionnaire question');
    };

    public create = (item): Promise<unknown> => {
        return apiQuery('post', `/questionnaire/${item.questionnaireId}/questions`, 'questionnaire question', item);
    };

    public patch = (id: string, item): Promise<unknown> => {
        return apiQuery(
            'patch',
            `/questionnaire/${item.questionnaireId}/questions/${id}`,
            'questionnaire question',
            item,
        );
    };

    public update = (item): Promise<unknown> => {
        return apiQuery('put', `/questionnaire/${item.questionnaireId}/questions`, 'questionnaire question', item);
    };

    public updateSortOrder = (questionnaireId, ids: Array<{ id: string; sortOrder: number }>): Promise<unknown> => {
        return apiQuery('put', `/questionnaire/${questionnaireId}/questions/sortOrder`, 'questionnaire question', {
            orderList: ids,
        });
    };

    public remove = (id: string, item): Promise<unknown> => {
        return apiQuery('delete', `/questionnaire/${item.questionnaireId}/questions/${id}`, 'questionnaire question');
    };
}

export const questionnaireQuestionsApi = new QuestionnaireQuestionsApi(
    '/questionnaire/questions',
    'questionnaire questions',
);
