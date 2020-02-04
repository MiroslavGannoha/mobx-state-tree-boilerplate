import apiQuery, { CRUDAPI, IPagedSearchParams, ISearchParams } from './Utils';

interface IQuestionnaireFilterParams extends IPagedSearchParams {
    filterType?: 'intake' | 'deleted';
}
class QuestionnairesApi extends CRUDAPI {
    constructor() {
        super('questionnaires', 'questionnaires');
    }

    public getAllForClient = (clientId: string, params?: ISearchParams): Promise<unknown[]> => {
        return apiQuery('get', `/${this.servicePath}/client/${clientId}`, this.serviceName, params);
    };

    public getQuestionnaireQuestions = (questionnaireId: string): Promise<unknown[]> => {
        return apiQuery('get', `/questionnaire/${questionnaireId}/questions`, this.serviceName).then((response) => {
            if (response.length && typeof response[0].sortOrder === 'number') {
                response.sort((a, b) => a.sortOrder - b.sortOrder);
            }
            return response;
        });
    };

    public updateQuestionnaireQuestion = (question): Promise<unknown[]> => {
        return apiQuery('put', `/questionnaire/${question.questionnaireId}/questions`, this.serviceName, question);
    };

    public patchQuestionnaireQuestion = (questionnaireId: string, questionId: string): Promise<unknown[]> => {
        return apiQuery('patch', `/questionnaire/${questionnaireId}/questions/${questionId}`, 'question');
    };

    public getAllPaged = (params: IQuestionnaireFilterParams): Promise<unknown[]> => {
        const { filterType, ...otherParams } = params;
        
        return apiQuery(
            'get',
            `/${this.servicePath}${filterType ? '/' + filterType : ''}/paged`,
            'Questionnaires',
            otherParams || params,
        );
    };

    public totalCount = (params: IQuestionnaireFilterParams): Promise<number> => {
        const { filterType, ...otherParams } = params;
        return apiQuery(
            'get',
            `/${this.servicePath}${filterType ? '/' + filterType : ''}/count`,
            'questionnaires count',
            otherParams || params,
        ).then(({ count }) => count);
    };

    // public getAllPagedIntake = (params?: IPagedSearchParams): Promise<unknown[]> => {
    //     return apiQuery('get', `/${this.servicePath}/intake/paged`, 'Intake Questionnaires', params);
    // };

    // public totalCountIntake = (params?: ISearchParams): Promise<number> => {
    //     return apiQuery('get', `/${this.servicePath}/intake/count`, 'Intake questionnaires count', params).then(
    //         ({ count }) => count,
    //     );
    // };

    // public getAllPagedForm = (params?: IPagedSearchParams): Promise<unknown[]> => {
    //     return apiQuery('get', `/${this.servicePath}/form/paged`, 'Form Questionnaires', params);
    // };

    // public totalCountForm = (params?: ISearchParams): Promise<number> => {
    //     return apiQuery('get', `/${this.servicePath}/form/count`, 'Form questionnaires count', params).then(
    //         ({ count }) => count,
    //     );
    // };

    // public getAllPagedDeleted = (params?: IPagedSearchParams): Promise<unknown[]> => {
    //     return apiQuery('get', `/${this.servicePath}/deleted/paged`, 'Deleted Questionnaires', params);
    // };

    // public totalCountDeleted = (params?: ISearchParams): Promise<number> => {
    //     return apiQuery('get', `/${this.servicePath}/deleted/count`, 'Deleted questionnaires count', params).then(
    //         ({ count }) => count,
    //     );
    // };

    public getPublicQuestionnaireQuestions = (
        firmId: string,
        clientId: string,
        questionnaireId: string,
    ): Promise<unknown[]> => {
        return apiQuery(
            'get',
            `/questionnaire/${questionnaireId}/firm/${firmId}/client/${clientId}/questions`,
            'questionnaire questions',
        ).then((response) => {
            if (response.length && typeof response[0].sortOrder === 'number') {
                response.sort((a, b) => a.sortOrder - b.sortOrder);
            }
            return response;
        });
    };

    public updatePublicQuestionnaireQuestion = (
        firmId: string,
        clientId: string,
        questionnaireId: string,
        question,
    ): Promise<unknown[]> => {
        return apiQuery(
            'put',
            `/questionnaire/${questionnaireId}/firm/${firmId}/client/${clientId}/questions`,
            'questionnaire question',
            question,
        );
    };
}

export const questionnairesApi = new QuestionnairesApi();
