import { MSTFormInput } from 'app/components/MSTForm';
import { useRootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { getRelativePath } from 'mobx-state-tree';
import * as React from 'react';
import { Alert, Button, Card, CardBody, Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import {IQuestionMSTFormProps} from '../QuestionMSTForm';

const LanguageContentCard = observer(({ questionLanguage }) => (
    <Card color="light" className="animated fadeIn">
        <CardBody>
            <MSTFormInput MSTForm={questionLanguage} path="/title" labelMsg="title" type="textarea" rules="required" />
            <MSTFormInput MSTForm={questionLanguage} path="/placeholder" labelMsg="placeholder" />
            <MSTFormInput MSTForm={questionLanguage} path="/instruction" labelMsg="instruction" />
        </CardBody>
    </Card>
));
export const QuestionLanguagesForm = observer(({ question, selectedLanguageId }: IQuestionMSTFormProps) => {
    const { languagesStore } = useRootStore();
    const [localLangId, setLocalLangId] = React.useState<string | null | undefined>(null);
    const { questionLanguages } = question;

    React.useEffect(() => {
        languagesStore.fetchAllOnce();
    }, []);

    React.useEffect(() => {
        !selectedLanguageId && setLocalLangId(languagesStore.defaultLanguage?.id);
    }, [languagesStore.defaultLanguage]);

    React.useEffect(() => {
        selectedLanguageId && setLocalLangId(selectedLanguageId);
    }, [question]);

    const languageItem = questionLanguages?.find(({ languageId }) => localLangId === languageId.id);

    function createLangContentItem(e) {
        e.preventDefault();

        question.applyPatch({
            path: '/questionLanguages/',
            op: 'add',
            value: { languageId: localLangId },
        });
    }
    function removeLangContentItem() {
        languageItem &&
            question.applyPatch({
                path: getRelativePath(question, languageItem),
                op: 'remove',
            });
    }

    const questionBtnGroupList = languagesStore.itemsArray.map(({ id, name }) => {
        const langContent = questionLanguages.find(({ languageId }) => languageId.id === id);
        function onLangNavClick() {
            setLocalLangId(id);
        }
        const isActive = id === localLangId;
        const showError = langContent && !langContent.isValid && langContent.errorsShown;
        const linkClass = showError ? (isActive ? 'bg-danger' : 'text-danger') : '';
        return (
            <NavItem key={id}>
                <NavLink active={isActive} href="#" onClick={onLangNavClick} className={linkClass}>
                    {name}
                    {langContent && <i className="fas fa-check ml-2" />}
                </NavLink>
            </NavItem>
        );
    });

    const emptyLanguageContent = (
        <div>
            <Alert color="gray-300">
                <div>No content added for selected language.</div>
                <a href="#" onClick={createLangContentItem} className="alert-link">
                    Add Content
                </a>
            </Alert>
        </div>
    );

    const languagePath = languageItem && getRelativePath(question, languageItem);

    return (
        <>
            <h5 className="mb-3 text-center">Language Content</h5>
            <Row>
                <Col sm="auto">
                    <Nav vertical pills>
                        {questionBtnGroupList}
                    </Nav>
                </Col>
                <Col>
                    {languagePath ? <LanguageContentCard questionLanguage={languageItem} /> : emptyLanguageContent}
                </Col>
                <Col xs="auto" className="pl-0">
                    {languagePath && (
                        <Button size="sm" color="light" onClick={removeLangContentItem}>
                            <i className="far fa-trash-alt" />
                        </Button>
                    )}
                </Col>
            </Row>
        </>
    );
});
