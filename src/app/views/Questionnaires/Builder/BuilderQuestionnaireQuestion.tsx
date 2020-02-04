import { IQuestionnaireQuestion } from 'app/stores/QuestionnairesStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardBody, Row, Col, Button, Badge } from 'reactstrap';
import { inputTypes } from 'app/constants/questionnaire';
import { CardBlockSpinner } from 'app/components/Spinner';

interface IBuilderQuestionDnDProps extends IBuilderQuestionProps {
    index: number;
    provided: unknown;
}

interface IBuilderQuestionProps {
    question: IQuestionnaireQuestion;
    selectedLanguageId: string | null;
    onEdit: (qQuestion: IQuestionnaireQuestion) => void;
    onDelete: (qQuestion: IQuestionnaireQuestion) => void;
}

export const BuilderQuestionDnDItem = observer(
    ({ question, index, selectedLanguageId, onEdit, onDelete }: IBuilderQuestionDnDProps) => {
        const { id } = question;

        const DnDContent = (provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-2">
                <BuilderQuestionnaireQuestion
                    question={question}
                    selectedLanguageId={selectedLanguageId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        );

        return (
            <Draggable draggableId={id || 'new-item'} index={index}>
                {DnDContent}
            </Draggable>
        );
    },
);

const elementTypeIcon = [
    '',
    'fas fa-font',
    'far fa-comment-alt',
    'far fa-dot-circle',
    'far fa-keyboard',
    'fas fa-th-list',
    'far fa-list-alt',
    'far fa-check-square',
];

export const BuilderQuestionnaireQuestion = observer(
    ({ question, onEdit, onDelete, selectedLanguageId }: IBuilderQuestionProps) => {
        const { questionLanguages, displayType, syncing, removing, posting } = question;
        let langContent =
            selectedLanguageId && questionLanguages?.find(({ languageId }) => selectedLanguageId === languageId.id);
        if (!langContent) {
            langContent = questionLanguages?.find(({ language }) => language === 'English');
        }
        if (!langContent) {
            langContent = questionLanguages && questionLanguages.length ? questionLanguages[0] : null;
        }
        const elementLabel = inputTypes[displayType];
        const elementIconClass = elementTypeIcon[displayType];
        const questionLangsBadges = questionLanguages?.map(({ languageId: { id, code } }) => (
            <Badge key={id} color="light" size="sm" className="mr-2">
                {code}
            </Badge>
        ));
        function onEditLocal() {
            onEdit(question);
        }
        function onDeleteLocal() {
            onDelete(question);
        }

        return (
            <Card className="mb-0">
                <CardBody className="p-2 pl-3">
                    <Row className="justify-content-between">
                        <Col>
                            <div>
                                <i className={elementIconClass + ' mr-2 text-primary'} />
                                {elementLabel}
                            </div>
                            <div className="font-weight-boldy">{langContent?.title}</div>
                            <div className="mt-2">Content in {questionLangsBadges}</div>
                        </Col>
                        <Col xs="auto">
                            <div className="mb-2">
                                <Button color="secondary" size="sm" onClick={onEditLocal}>
                                    <i className="far fa-edit" />
                                </Button>
                            </div>
                            <Button color="secondary" size="sm" onClick={onDeleteLocal}>
                                <i className="far fa-trash-alt" />
                            </Button>
                        </Col>
                    </Row>
                    {(syncing || removing || posting) && <CardBlockSpinner />}
                </CardBody>
            </Card>
        );
    },
);
