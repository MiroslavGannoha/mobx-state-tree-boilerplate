import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IRootStore } from '../../../stores';
import { Card, CardBody, Row, Col, NavItem, NavLink, Nav } from 'reactstrap';
import { RoleRestriction } from '../../../components/RoleRestriction';
import DetailsViewDecorator, { IDetailsViewDecoratorProps } from 'app/decorators/CRUD/DetailsViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import CardHeaderDetails from 'app/components/CardHeaderDetails';
import KeyValueTable from 'app/components/KeyValueTable';
import ViewHeader from 'app/components/ViewHeader';
import { yesNoRender } from 'app/components/Table';
import { inputTypes, inputFormats } from 'app/constants/questionnaire';
import { when } from 'mobx';

@inject(({ questionsStore, optionListStore, languagesStore }: IRootStore) => ({
    store: questionsStore,
    optionListStore,
    languagesStore,
}))
@DetailsViewDecorator
@observer
class QuestionDetails extends React.Component<IDetailsViewDecoratorProps> {
    public state = {
        selectedLanguageId: null,
    };

    public componentWillMount() {
        const { optionListStore, languagesStore, item } = this.props;
        optionListStore.fetchAllOnce();
        languagesStore.fetchAllOnce();
        when(
            () => item.questionLanguages.length > 0 && languagesStore.itemsArray.length > 0,
            () => {
                console.log(languagesStore, languagesStore.defaultLanguage);
                
                const defaultItem = item.questionLanguages.find(
                    ({ languageId: { id } }) => id === languagesStore.defaultLanguage.id,
                );
                this.setState({ selectedLanguageId: defaultItem.languageId.id });
            },
        );
    }

    public render() {
        const { item, editBtn, cancelBtn, deleteBtn } = this.props;
        const { selectedLanguageId } = this.state;

        const {
            modified,
            created,
            correctAnswer,
            displayType,
            inputFormat,
            lines,
            maxLength,
            isRequired,
            mask,
            sortOrder,
            optionListId,
            questionLanguages,
            isGroup,
            // groupQuestions,
        } = item;

        const fields = [
            { label: 'input-type', value: inputTypes[displayType] },
            { label: 'input-format', value: inputFormats[inputFormat] },
            { label: 'sort-order', value: sortOrder },
            { label: 'required', value: yesNoRender(isRequired) },
            { label: 'group', value: yesNoRender(isGroup) },
        ];
        const fields2 = [
            { label: 'lines', value: lines },
            { label: 'max-length', value: maxLength },
            { label: 'mask', value: mask || '-' },
            { label: 'option-list', value: optionListId?.name || '-' },
            {
                label: 'correct-answer',
                value:
                    optionListId && optionListId.options
                        ? optionListId.options.get(correctAnswer)?.name
                        : correctAnswer,
            },
        ];

        const selectedContent = questionLanguages.find(({ languageId }) => languageId.id === selectedLanguageId);
        const fields3 = [
            { label: 'title', value: selectedContent?.title },
            { label: 'placeholder', value: selectedContent?.placeholder },
            { label: 'instruction', value: selectedContent?.instruction },
        ];

        const onLangNavClick = (id) => () => this.setState({ selectedLanguageId: id });

        const questionBtnGroupList = questionLanguages.map(({ languageId }) => {

            if (!languageId) {
                return null;
            }
            const { name, id } = languageId;

            return (
                <NavItem key={id}>
                    <NavLink active={id === selectedLanguageId} href="#" onClick={onLangNavClick(id)}>
                        {name}
                    </NavLink>
                </NavItem>
            );
        });

        return (
            <ViewContainer>
                <ViewHeader titleKey="questions">
                    <RoleRestriction allowedRoles={['Staff']}>
                        {editBtn}
                        {deleteBtn}
                    </RoleRestriction>
                    <span className="ml-2">{cancelBtn}</span>
                </ViewHeader>
                <Card>
                    <CardHeaderDetails created={created} modified={modified} />
                    <CardBody>
                        <Row>
                            <Col>
                                <KeyValueTable fields={fields} />
                            </Col>
                            <Col>
                                <KeyValueTable fields={fields2} />
                            </Col>
                        </Row>
                        <hr />
                        <h5 className="mb-3 text-center">Language Content</h5>
                        <Row>
                            <Col sm="auto">
                                <Nav vertical pills>
                                    {questionBtnGroupList}
                                </Nav>
                            </Col>
                            <Col>
                                {selectedContent && (
                                    <Card color="light" className="animated fadeIn">
                                        <CardBody>
                                            <KeyValueTable fields={fields3} className="table-transparent w-auto" />
                                        </CardBody>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ViewContainer>
        );
    }
}

export default QuestionDetails;
