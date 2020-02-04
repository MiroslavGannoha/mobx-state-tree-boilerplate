import * as React from 'react';
import { Card, CardBody, Form, CardFooter, Button } from 'reactstrap';
import ViewContainer from 'app/components/ViewContainer';
import FormattedMsg from '../../../components/i18n/FormattedMsg';
import { QuestionMSTForm } from '../Form/QuestionMSTForm';
import { useRootStore } from 'app/stores';
import { IQuestion } from 'app/stores/QuestionsStore';
import { documentTypes } from 'app/constants/documentTypes';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import ViewHeader from 'app/components/ViewHeader';
import { SpinnerInCard } from 'app/components/Spinner';

const EditQuestion = observer(() => {
    const params = useParams<{ Question: string }>();
    const history = useHistory();
    const {questionsStore} = useRootStore();
    const [item, setItem] = React.useState<IQuestion | null>(null);
    const [loading, setLoading] = React.useState(false);
    const questionId = params.Question;
    const { collections } = useRootStore();
    React.useEffect(() => {
        if (questionId) {
            let questionToEdit = collections?.get(documentTypes.Question)?.getItem(questionId);
            if (!questionToEdit) {
                setLoading(true);
                questionsStore.fetchItem(questionId)
                    .then(() => setLoading(false));
                questionToEdit = collections?.get(documentTypes.Question)?.getItem(questionId);
            }
            setItem(questionToEdit);
        }
    }, []);

    const listPath = questionsStore.getListPath();

    function onSubmit(e) {
        e.preventDefault();
            item?.submit()
                .then(() => {
                    setLoading(true);
                    return item.sync();
                })
                .then(() => {
                    history.push(questionsStore.getItemPath({Question: item.id}));
                })
                .catch(() => setLoading(false));
    }
    
    function goToList() { history.push(listPath); }

    const form = (
        <Form className="form-horizontal" onSubmit={onSubmit}>
            <Card>
                <CardBody>
                    {item && <QuestionMSTForm question={item} /> }
                </CardBody>
                <CardFooter className="text-right bg-white">
                    <Button color="secondary" onClick={goToList} size="sm">
                        <FormattedMsg id="cancel" />
                    </Button>
                    <Button type="submit" color="primary" className="ml-3" size="sm">
                        <FormattedMsg id="submit" />
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    );

    return (
        <ViewContainer>
            <ViewHeader titleKey="edit-question" />
            {loading ? <SpinnerInCard /> : form}
        </ViewContainer>
    );
});

export default EditQuestion;
