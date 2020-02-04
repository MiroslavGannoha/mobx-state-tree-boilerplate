import * as React from 'react';
import { SpinnerInCard } from 'app/components/Spinner';
import ViewHeader from 'app/components/ViewHeader';
import { defaultItemsPerPage } from 'app/constants';
import { documentTypes } from 'app/constants/documentTypes';
import { useRootStore } from 'app/stores';
import { QuestionBase } from 'app/stores/QuestionsStore';
import { observer } from 'mobx-react';
import { Droppable } from 'react-beautiful-dnd';
import { Button, Form, FormText, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { QuestionsDnDList } from './QuestionsDnDList';



const QuestionTemplatesList = observer(({setSelectedQuestion, onQuestionDelete, selectedLanguageId}) => {
    const { languagesStore, questionsStore } = useRootStore();
    const { defaultLanguage } = languagesStore;
    const { pagedItems: questions, loading: questionsLoading, pagingParams, total } = questionsStore;
    React.useEffect(() => {
        questionsStore.fetchPaged();
        questionsStore.fetchTotal();
    }, []);

    function createQuestion() {
        const newQuestion = QuestionBase.create({
            questionLanguages: [{ languageId: defaultLanguage.id }],
            documentType: documentTypes.Question,
        });
        setSelectedQuestion(newQuestion);
        questionsStore.applyPatch({ op: 'add', path: '/draftItems/', value: newQuestion });
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

    const questionContainerHeight = window.innerHeight - 280;

    return (
        <div className="sticky-top pt-2">
            <ViewHeader tag="h5" titleKey="templates" iconClass="far fa-file-alt">
                <Button size="sm" color="primary" onClick={createQuestion}>
                    <i className="fas fa-plus mr-2" />
                        Add
                </Button>
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
                        <strong>{pagingParams.itemsPerPage < total ? pagingParams.itemsPerPage : total}</strong>.
                            Total results <strong>{total}</strong>.
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
                            <QuestionsDnDList
                                provided={provided}
                                questions={questions}
                                langId={selectedLanguageId}
                                onEdit={setSelectedQuestion}
                                onDelete={onQuestionDelete}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {questionsLoading && <SpinnerInCard />}
            </div>
        </div>
    );
});

export default QuestionTemplatesList;
