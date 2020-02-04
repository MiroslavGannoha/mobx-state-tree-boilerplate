import * as React from 'react';
import { questionnaireQuestionsApi } from 'app/api';
import ViewContainer from 'app/components/ViewContainer';
import { documentTypes } from 'app/constants/documentTypes';
import { useRootStore } from 'app/stores';
import { IQuestionnaireQuestionBase, QuestionnaireQuestionBase } from 'app/stores/QuestionnairesStore/models';
import { IQuestion, IQuestionBase } from 'app/stores/QuestionsStore';
import { observer } from 'mobx-react';
import { applyPatch, getSnapshot } from 'mobx-state-tree';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { Col, Row, Button } from 'reactstrap';
import { BuilderQuestionModal } from './BuilderQuestionModal';
import QuestionTemplatesList from './QuestionTemplatesList';
import QuestionnaireQuestionsList from './QuestionnaireQuestionsList';
import ViewHeader from 'app/components/ViewHeader';
import { LoadingButton } from 'app/components/LoadingButton';
import { useParams, useHistory } from 'react-router-dom';
import { History } from 'history';

const QuestionnaireBuilder = observer(() => {
    const questionnaireId: string = useParams()[documentTypes.Questionnaire];
    const history: History = useHistory();
    const { questionnairesStore, questionsStore } = useRootStore();
    const [selectedQuestion, setSelectedQuestion] = React.useState<
            IQuestionnaireQuestionBase | IQuestionBase | null
        >(null);
    const [selectedLanguageId, setSelectedLanguageId] = React.useState<string | undefined>(undefined);
    const [saveOrderLoading, setSaveOrderLoading] = React.useState<boolean>(false);
    const {
        detailsStore,
        detailsStore: { questionnaireQuestionsStore },
    } = questionnairesStore;
    const { questions: qQuestions } = questionnaireQuestionsStore;
    const { pagedItems: questions } = questionsStore;
    React.useEffect(() => {
        detailsStore.setItem(questionnaireId);
        questionnaireQuestionsStore.fetchAll({ questionnaireId });
    }, []);

    function onSaveOrder() {
        setSaveOrderLoading(true);
        questionnaireQuestionsApi
            .updateSortOrder(
                questionnaireId,
                qQuestions.map(({ id }, index) => ({ id: id || '', sortOrder: index + 1 })),
            )
            .then(() => toast.success('Order Saved'))
            .catch(() => toast.error('Failed to Save Order'))
            .then(() => setSaveOrderLoading(false));
    }

    function onDragEnd(result: DropResult) {
        const { draggableId, source, destination } = result;
        if (destination) {
            if (source.droppableId === 'templates') {
                const questionToCopy: IQuestion = questions.find(({ id }) => id === draggableId);
                const { id, modified, created, documentType, ...snapshotBody } = getSnapshot(questionToCopy);
                const newQQuestion = QuestionnaireQuestionBase.create({
                    ...snapshotBody,
                    sortOrder: destination.index,
                    questionnaireId,
                    questionId: id,
                    documentType: documentTypes.QuestionnaireQuestion,
                });
                applyPatch(qQuestions, { op: 'add', path: '/' + destination.index, value: newQQuestion });
                newQQuestion.post().then(onSaveOrder);
            } else {
                const questionToMove = qQuestions.find(({ id }) => id === draggableId);
                    questionToMove?.detach();
                    applyPatch(qQuestions, { op: 'add', path: '/' + destination.index, value: questionToMove });
            }
        }

    }

    const onModalClose = () => {
        const currentQuestion = selectedQuestion;
        setSelectedQuestion(null);
        if (currentQuestion && !currentQuestion.created) {
            currentQuestion.destroy();
        }
    };

    function onQuestionDelete(question) {
        const questionToDelete = question;
        if (!questionToDelete) {
            return;
        }
        if (questionToDelete.created) {
            questionToDelete
                .remove()
                .then(questionToDelete.detach)
                .catch((e) => toast.error('Failed to delete question ', e.message));
        }
    }

    function onPreviewClick() {
        history.push('/dashboard');
    }

    return (
        <ViewContainer>
            <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                    <Col sm="8">
                        <ViewHeader tag="h4" titleKey="builder" iconClass="fas fa-boxes">
                            <Button size="sm" color="primary" onClick={onPreviewClick} className="mr-3">
                                <i className="far fa-eye mr-2" />
                                    Preview
                            </Button>
                            <LoadingButton
                                size="sm"
                                color="primary"
                                onClick={onSaveOrder}
                                loading={saveOrderLoading}
                            >
                                <i className="fas fa-save mr-2" />
                                    Save Order
                            </LoadingButton>
                        </ViewHeader>
                        <QuestionnaireQuestionsList 
                            setSelectedQuestion={setSelectedQuestion}
                            setSelectedLanguageId={setSelectedLanguageId}
                            selectedLanguageId={selectedLanguageId}
                            onQuestionDelete={onQuestionDelete}
                        />
                    </Col>
                    <Col sm="4">
                        <QuestionTemplatesList
                            setSelectedQuestion={setSelectedQuestion}
                            onQuestionDelete={onQuestionDelete}
                            selectedLanguageId={selectedLanguageId}
                        />
                    </Col>
                </Row>
            </DragDropContext>

            <BuilderQuestionModal
                question={selectedQuestion}
                onClose={onModalClose}
                selectedLanguageId={selectedLanguageId}
            />
        </ViewContainer>
    );
});

export default QuestionnaireBuilder;
