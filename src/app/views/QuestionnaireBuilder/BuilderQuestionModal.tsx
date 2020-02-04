import { IQuestionnaireQuestion } from 'app/stores/QuestionnairesStore';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import * as React from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from 'reactstrap';
import { QuestionMSTForm } from './QuestionMSTForm';
import { IQuestion } from 'app/stores/QuestionsStore';
import { DocTypes } from 'app/constants';
interface IBuilderQuestionModalProps {
    question: IQuestionnaireQuestion | IQuestion | null;
    onClose: () => void;
    onSubmit: () => void;
    onSubmitTemplate: () => void;
    onDelete: () => void;
    selectedLanguageId: string | undefined;
}
let initialSnapshot: null | obj = null;
export const BuilderQuestionModal = observer(
    ({ question, onClose, onSubmit, onSubmitTemplate, selectedLanguageId }: IBuilderQuestionModalProps) => {
        React.useEffect(() => {
            initialSnapshot = question && getSnapshot(question);
        }, [question]);

        function onCloseLocal() {
            if (question && initialSnapshot) {
                question.applySnapshot(initialSnapshot);
            }
            onClose();
        }

        function saveAndUpdateTemplate () {
            onSubmit();
            onSubmitTemplate();
        }
        const saveAndUpdateTemplateBtn = (
            <Button onClick={saveAndUpdateTemplate} size="sm" color="primary" className="ml-2">
                Save & Update Template
            </Button>
        );
        const isTemplate =  question?.documentType === DocTypes.Question;
        return (
            <Modal isOpen={!!question} toggle={onCloseLocal} size="lg">
                <ModalHeader className="py-2">Edit Question</ModalHeader>
                <ModalBody>
                    {question && (
                        <QuestionMSTForm
                            question={question}
                            selectedLanguageId={selectedLanguageId}
                        />
                    )}
                </ModalBody>
                <ModalFooter className="px-3 py-2 justify-content-end">
                    {/* <div>{question?.created && editControls}</div> */}
                    <div>
                        <Button onClick={onCloseLocal} size="sm" className="mr-2">
                            Cancel
                        </Button>

                        <Button onClick={onSubmit} size="sm" color="primary">
                            Save Question
                        </Button>
                        {question?.created && !isTemplate && saveAndUpdateTemplateBtn}
                    </div>
                </ModalFooter>
            </Modal>
        );
    },
);
