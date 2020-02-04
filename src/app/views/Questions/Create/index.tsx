import * as React from 'react';
import { Card, CardBody, Form, Button, CardFooter } from 'reactstrap';
import ViewContainer from 'app/components/ViewContainer';
import FormattedMsg from '../../../components/i18n/FormattedMsg';
import { QuestionMSTForm } from '../Form/QuestionMSTForm';
import { useRootStore } from 'app/stores';
import { QuestionBase, IQuestionBase, IQuestion } from 'app/stores/QuestionsStore';
import { documentTypes } from 'app/constants/documentTypes';
import { observer } from 'mobx-react';
import ViewHeader from 'app/components/ViewHeader';
import { getSnapshot } from 'mobx-state-tree';
import { SpinnerInCard } from 'app/components/Spinner';
import { useHistory } from 'react-router-dom';

const CreateQuestion = observer(() => {
    const history = useHistory();
    const {questionsStore, self: {saveToCollection}} = useRootStore();
    const [item, setItem] = React.useState<IQuestionBase | null>(null);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        const newQuestion = QuestionBase.create({
            documentType: documentTypes.Question,
        });
        setItem(newQuestion);
        questionsStore.applyPatch({op: 'add', path: '/draftItems/', value: newQuestion});
    }, []);

    const listPath = questionsStore.getListPath();

    function onSubmit(e) {
        e.preventDefault();
        item?.submit()
            .then(() => {
                setLoading(true);
                return item.post();
            })
            .then(() => {
                const snapshot = getSnapshot(item);
                item.destroy();
                const collectionoItem: IQuestion = saveToCollection(snapshot);
                history.push(questionsStore.getItemPath({Question: collectionoItem.id}));
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
            <ViewHeader titleKey="create-question" />
            {loading ? <SpinnerInCard /> : form}
        </ViewContainer>
    );
});

export default CreateQuestion;
