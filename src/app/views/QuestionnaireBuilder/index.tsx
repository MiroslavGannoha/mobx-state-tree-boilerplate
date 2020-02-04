import { questionnaireQuestionsApi } from 'app/api';
import { LoadingButton } from 'app/components/LoadingButton';
import { SpinnerInCard } from 'app/components/Spinner';
import ViewContainer from 'app/components/ViewContainer';
import ViewHeader from 'app/components/ViewHeader';
import { defaultItemsPerPage } from 'app/constants';
import { documentTypes } from 'app/constants/documentTypes';
import { useRootStore } from 'app/stores';
import { IQuestionnaireQuestionBase, QuestionnaireQuestionBase } from 'app/stores/QuestionnairesStore/models';
import { observer } from 'mobx-react';
import { applyPatch, getSnapshot } from 'mobx-state-tree';
import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { RouteComponentProps, withRouter } from 'react-router';
import { toast } from 'react-toastify';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    CustomInput,
    Form,
    FormText,
    Input,
    InputGroup,
    InputGroupAddon,
    Row,
} from 'reactstrap';
import { BuilderQuestionModal } from './BuilderQuestionModal';
import { BuilderQuestionDnDItem } from './BuilderQuestionnaireQuestion';
import { QuestionBase, IQuestionBase, IQuestion } from 'app/stores/QuestionsStore';

const DnDItemsList = observer(({ questions, provided, langId, onEdit, onDelete }) =>
    questions?.map((item, index) => (
        <BuilderQuestionDnDItem
            question={item}
            index={index}
            key={item.id + '-' + item.questionnaireId}
            selectedLanguageId={langId}
            provided={provided}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    )),
);

const QuestionnaireBuilder = withRouter(
    observer(({ match: { params } }: RouteComponentProps<{ Questionnaire: string }>) => {
        const questionnaireId = params[documentTypes.Questionnaire];
        const { questionnairesStore, languagesStore, optionListStore, questionsStore } = useRootStore();
        const { itemsArray: languages, loading: languagesLoading, defaultLanguage } = languagesStore;
        const [selectedQQuestion, setSelectedQQuestion] = React.useState<
            IQuestionnaireQuestionBase | IQuestionBase | null
        >(null);
        const [selectedLanguageId, setSelectedLanguageId] = React.useState<string | undefined>(undefined);
        const [saveOrderLoading, setSaveOrderLoading] = React.useState<boolean>(false);
        const [createLoading, setCreateLoading] = React.useState<boolean>(false);
        const {
            detailsStore,
            detailsStore: { questionnaireQuestionsStore },
        } = questionnairesStore;
        const { questions: qQuestions, loading: qQuestionsLoading } = questionnaireQuestionsStore;
        const { pagedItems: questions, loading: questionsLoading, pagingParams, total } = questionsStore;
        React.useEffect(() => {
            detailsStore.setItem(questionnaireId);
            questionnaireQuestionsStore.fetchAll({ questionnaireId });
            languagesStore.fetchAllOnce();
            optionListStore.fetchAllOnce();
            questionsStore.fetchPaged();
            questionsStore.fetchTotal();
        }, []);

        React.useEffect(() => {
            if (languages.length) {
                setSelectedLanguageId(defaultLanguage ? defaultLanguage.id : languages[0]);
            }
        }, [languages]);

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

        function onDragEnd({ draggableId, source, destination }) {
            if (!destination) {
                return;
            }
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

        const onModalClose = () => {
            const currentStep = selectedQQuestion;
            setSelectedQQuestion(null);
            if (currentStep && !currentStep.created) {
                currentStep.destroy();
            }
        };

        function onQQuestionSubmit() {
            if (!selectedQQuestion) {
                return;
            }
            selectedQQuestion
                .submit()
                .then(() => Promise.all(selectedQQuestion.questionLanguages.map((qLang) => qLang.submit())))
                .then(() => {
                    setSelectedQQuestion(null);
                    if (selectedQQuestion.created) {
                        selectedQQuestion.sync().catch((e) => {
                            toast.error('Failed to update question: ', e);
                        });
                    } else {
                        setCreateLoading(true);
                        selectedQQuestion
                            .post()
                            .then(() => {
                                setCreateLoading(false);
                                questionsStore.clearPagedItems();
                                questionsStore.setSearchText(selectedQQuestion.titleDefault || '');
                                selectedQQuestion.destroy();
                                questionsStore.fetchTotal();
                                questionsStore.fetchPaged();
                            })
                            .catch(() => setCreateLoading(false));
                    }
                });
        }

        function submitTemplate() {
            const { id, modified, created, documentType, ...snapshotBody } = getSnapshot(
                selectedQQuestion,
            );
            const templateQuestion = selectedQQuestion.questionId;
            const templateSnapshot = getSnapshot(templateQuestion);
            templateQuestion.applySnapshot({...templateSnapshot, ...snapshotBody});
            selectedQQuestion.questionId.sync().catch((e) => {
                toast.error('Failed to update question template: ', e);
            });
        }

        function onQQuestionDelete(question) {
            const questionToDelete = question || selectedQQuestion;
            setSelectedQQuestion(null);
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

        function createQuestion() {
            const newQuestion = QuestionBase.create({
                questionLanguages: [{ languageId: defaultLanguage.id }],
                documentType: documentTypes.Question,
            });
            setSelectedQQuestion(newQuestion);
            questionsStore.applyPatch({ op: 'add', path: '/draftItems/', value: newQuestion });
        }

        function setLanguage(e) {
            setSelectedLanguageId(e.target.value);
        }
        function onQuestionsSearchChange({ target: { value } }) {
            questionsStore.setSearchText(value);
        }
        function onQuestionsSearchSubmit(e) {
            e.preventDefault();
            questionsStore.setPagingParams({ ...pagingParams, itemsPerPage: defaultItemsPerPage });
            questionsStore.clearPagedItems();
            questionsStore.fetchTotal();
            questionsStore.fetchPaged();
        }
        function displayMoreQuestions(e) {
            e.preventDefault();
            questionsStore.setPagingParams({
                ...pagingParams,
                itemsPerPage: pagingParams.itemsPerPage + defaultItemsPerPage,
            });
            questionsStore.fetchPaged();
        }

        const languageOptions = languages.map(({ id, name }) => (
            <CustomInput
                id={id}
                key={id}
                className="d-inline-block mr-3"
                type="radio"
                value={id}
                label={name}
                checked={selectedLanguageId === id}
                onChange={setLanguage}
            />
        ));
        const questionContainerHeight = window.innerHeight - 280;

        return (
            <ViewContainer>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Row>
                        <Col sm="8">
                            <ViewHeader tag="h4" titleKey="builder" iconClass="fas fa-boxes">
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
                            <Card color="gray-200">
                                <CardHeader>{languageOptions}</CardHeader>
                                <CardBody>
                                    {qQuestionsLoading || languagesLoading || !qQuestions ? (
                                        <SpinnerInCard />
                                    ) : (
                                        <Droppable droppableId="droppable">
                                            {(provided, snapshot) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    <DnDItemsList
                                                        provided={provided}
                                                        questions={qQuestions}
                                                        langId={selectedLanguageId}
                                                        onEdit={setSelectedQQuestion}
                                                        onDelete={onQQuestionDelete}
                                                    />
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <div className="sticky-top pt-2">
                                <ViewHeader tag="h5" titleKey="templates" iconClass="far fa-file-alt">
                                    <LoadingButton
                                        size="sm"
                                        color="primary"
                                        onClick={createQuestion}
                                        loading={createLoading}
                                    >
                                        <i className="fas fa-plus mr-2" />
                                        Add
                                    </LoadingButton>
                                </ViewHeader>
                                <div className="mb-2">
                                    <Form className="form-horizontal" onSubmit={onQuestionsSearchSubmit}>
                                        <InputGroup>
                                            <Input
                                                type="text"
                                                placeholder="Search Questions"
                                                value={pagingParams.searchText}
                                                onChange={onQuestionsSearchChange}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <Button color="primary" type="submit">
                                                    <i className="fa fa-search text-secondary" />
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FormText>
                                            <span>Showing recent</span>
                                            &nbsp;
                                            <strong>
                                                {pagingParams.itemsPerPage < total ? pagingParams.itemsPerPage : total}
                                            </strong>
                                            . Total results <strong>{total}</strong>.
                                            <a href="#" onClick={displayMoreQuestions} className="ml-2">
                                                Show More
                                            </a>
                                        </FormText>
                                    </Form>
                                </div>
                                <div
                                    style={{
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        maxHeight: questionContainerHeight,
                                    }}
                                >
                                    <Droppable droppableId="templates" isDropDisabled={true} isCombineEnabled={true}>
                                        {(provided, snapshot) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                <DnDItemsList
                                                    provided={provided}
                                                    questions={questions}
                                                    langId={selectedLanguageId}
                                                    onEdit={setSelectedQQuestion}
                                                    onDelete={onQQuestionDelete}
                                                />
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    {questionsLoading && <SpinnerInCard />}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </DragDropContext>

                <BuilderQuestionModal
                    question={selectedQQuestion}
                    onClose={onModalClose}
                    onSubmit={onQQuestionSubmit}
                    onSubmitTemplate={submitTemplate}
                    // onDelete={onQQuestionDelete}
                    selectedLanguageId={selectedLanguageId}
                />
            </ViewContainer>
        );
    }),
);

export default QuestionnaireBuilder;
