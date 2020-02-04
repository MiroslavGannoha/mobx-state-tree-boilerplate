import { SpinnerInCard } from 'app/components/Spinner';
import { documentTypes } from 'app/constants/documentTypes';
import { useRootStore } from 'app/stores';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card, CardBody, CardHeader, CustomInput } from 'reactstrap';
import { QuestionsDnDList } from './QuestionsDnDList';
import { useParams } from 'react-router-dom';

const QuestionnaireQuestionsList = observer(
    ({ setSelectedQuestion, selectedLanguageId, setSelectedLanguageId, onQuestionDelete }) => {
        const questionnaireId: string = useParams()[documentTypes.Questionnaire];
        const { questionnairesStore, languagesStore } = useRootStore();
        const { itemsArray: languages, loading: languagesLoading, defaultLanguage } = languagesStore;
        const {
            detailsStore: { questionnaireQuestionsStore },
        } = questionnairesStore;
        const { questions: qQuestions, loading: qQuestionsLoading } = questionnaireQuestionsStore;
        React.useEffect(() => {
            questionnaireQuestionsStore.fetchAll({ questionnaireId });
            languagesStore.fetchAllOnce();
        }, []);

        React.useEffect(() => {
            if (languages.length) {
                setSelectedLanguageId(defaultLanguage ? defaultLanguage.id : languages[0]);
            }
        }, [languages]);

        function setLanguage(e) {
            setSelectedLanguageId(e.target.value);
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

        return (
            <>
                <Card color="gray-200">
                    <CardHeader>{languageOptions}</CardHeader>
                    <CardBody>
                        {qQuestionsLoading || languagesLoading || !qQuestions ? (
                            <SpinnerInCard />
                        ) : (
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <QuestionsDnDList
                                            provided={provided}
                                            questions={qQuestions}
                                            langId={selectedLanguageId}
                                            onEdit={setSelectedQuestion}
                                            onDelete={onQuestionDelete}
                                        />
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </CardBody>
                </Card>
            </>
        );
    },
);

export default QuestionnaireQuestionsList;
