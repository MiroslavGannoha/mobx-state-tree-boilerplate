import FormattedMsg from 'app/components/i18n/FormattedMsg';
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
import { QuestionMSTForm } from 'app/views/Questions/Form';
import { IQuestion } from 'app/stores/QuestionsStore';
import { documentTypes } from 'app/constants/documentTypes';
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

        // const editControls = (
        //     <div>
        //         <UncontrolledButtonDropdown inNavbar>
        //             <DropdownToggle size="sm" caret>
        //                 More Actions
        //             </DropdownToggle>
        //             <DropdownMenu>
        //                 <DropdownItem onClick={onDelete}>
        //                     <i className="far fa-trash-alt text-danger" />
        //                     <FormattedMsg id="delete" />
        //                 </DropdownItem>
        //                 <DropdownItem onClick={onDelete}>
        //                     <i className="far fa-trash-alt text-danger" />
        //                     <FormattedMsg id="delete" />
        //                 </DropdownItem>
        //             </DropdownMenu>
        //         </UncontrolledButtonDropdown>
        //     </div>
        // );
        function saveAndUpdateTemplate () {
            onSubmit();
            onSubmitTemplate();
        }
        const saveAndUpdateTemplateBtn = (
            <Button onClick={saveAndUpdateTemplate} size="sm" color="primary" className="ml-2">
                Save & Update Template
            </Button>
        );
        const isTemplate =  question?.documentType === documentTypes.Question;
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
                            <FormattedMsg id="cancel" />
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
