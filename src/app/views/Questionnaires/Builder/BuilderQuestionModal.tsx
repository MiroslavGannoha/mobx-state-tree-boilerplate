import FormattedMsg from 'app/components/i18n/FormattedMsg';
import { IQuestionnaireQuestion } from 'app/stores/QuestionnairesStore';
import { observer } from 'mobx-react';
import { getSnapshot, SnapshotOut } from 'mobx-state-tree';
import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { QuestionMSTForm } from 'app/views/Questions/Form';
import { IQuestion } from 'app/stores/QuestionsStore';
import { documentTypes } from 'app/constants/documentTypes';
import { toast } from 'react-toastify';
import { useRootStore } from 'app/stores';
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
    ({ question, onClose, selectedLanguageId }: IBuilderQuestionModalProps) => {
        const {questionsStore} = useRootStore();

        React.useEffect(() => {
            initialSnapshot = question && getSnapshot(question);
        }, [question]);

        function onCloseLocal() {
            if (question && initialSnapshot) {
                question.applySnapshot(initialSnapshot);
            }
            onClose();
        }

        function onSubmit() {
            if (!question) {
                return;
            }
            question
                .submit()
                .then(() => Promise.all(question.questionLanguages.map((qLang) => qLang.submit())))
                .then(() => {
                    onClose();
                    if (question.created) {
                        question.sync().catch((e) => {
                            toast.error('Failed to update question: ', e);
                        });
                    } else {
                        question
                            .post()
                            .then(() => {
                                questionsStore.clearPagedItems();
                                questionsStore.setSearchText(question.titleDefault || '');
                                question.destroy();
                                questionsStore.fetchTotal();
                                questionsStore.fetchPaged();
                            });
                    }
                });
        }

        function onTemplateSubmit() {
            if (!question) { return; }
            const { id, modified, created, documentType, ...snapshotBody } = getSnapshot(question);
            const templateQuestion = question?.questionId;
            const templateSnapshot: SnapshotOut<IQuestion> = getSnapshot(templateQuestion);
            templateQuestion.applySnapshot({ ...templateSnapshot, ...snapshotBody });
            question?.questionId.sync().catch((e) => {
                toast.error('Failed to update question template: ', e);
            });
        }

        function saveAndUpdateTemplate() {
            onSubmit();
            onTemplateSubmit();
        }

        const saveAndUpdateTemplateBtn = (
            <Button onClick={saveAndUpdateTemplate} size="sm" color="primary" className="ml-2">
                Save & Update Template
            </Button>
        );
        const isTemplate = question?.documentType === documentTypes.Question;
        return (
            <Modal isOpen={!!question} toggle={onCloseLocal} size="lg">
                <ModalHeader className="py-2">Edit Question</ModalHeader>
                <ModalBody>
                    {question && <QuestionMSTForm question={question} selectedLanguageId={selectedLanguageId} />}
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
