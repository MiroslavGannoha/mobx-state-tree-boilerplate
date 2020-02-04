import apiQuery, { CRUDAPI } from './Utils';

class QuestionsApi extends CRUDAPI {
    public getSettings = (): Promise<unknown> => {
        return apiQuery(
            'get',
            '/questions/settings',
            'questions',
        );
    }
    public sortorder = (data): Promise<unknown> => {
        return apiQuery(
            'put',
            '/questions/sortorder',
            'questions',
            data,
        );
    }
}


export const questionsApi = new QuestionsApi('questions', 'questions');
