import { MSTFormCustomInput, MSTFormInput, MSTFormSelect } from 'app/components/MSTForm';
import { inputFormatOptions, inputTypesOptions } from 'app/constants/questionnaire';
import { useRootStore } from 'app/stores';
import { IQuestionnaireQuestion } from 'app/stores/QuestionnairesStore';
import { IQuestion, IQuestionBase } from 'app/stores/QuestionsStore';
import { observer } from 'mobx-react';
import { onPatch } from 'mobx-state-tree';
import * as React from 'react';
import { Col, FormGroup } from 'reactstrap';
import { QuestionLanguagesForm } from './QuestionLanguagesForm';

export interface IQuestionMSTFormProps {
    question: IQuestion | IQuestionBase | IQuestionnaireQuestion;
    selectedLanguageId?: string;
}

export const QuestionMSTForm = observer(({ question, selectedLanguageId }: IQuestionMSTFormProps) => {
    const { optionListStore } = useRootStore();
    const { displayType, optionListId, optionList, inputFormat } = question;

    React.useEffect(() => {
        optionListStore.fetchAllOnce();
    }, []);

    React.useEffect(() => {
        return onPatch(question, (patch) => {
            if (patch.path === '/optionListId') {
                question.applyPatch({ path: '/correctAnswer', op: 'replace', value: null });
            } else if (patch.path === '/displayType' && optionListId) {
                question.applyPatch({
                    path: '/optionListId',
                    op: 'replace',
                    value: null,
                });
            }
        });
    }, [question]);

    const { itemsArray: optionListArray, loading: optionListLoading } = optionListStore;

    let correctAnswerField = (
        <MSTFormInput
            MSTForm={question}
            path="/correctAnswer"
            labelMsg="correct-answer"
            type={displayType === 2 ? 'textarea' : 'text'}
        />
    );

    if ([3, 5, 6, 7].includes(displayType)) {
        const valuesMapItem =
            optionList &&
            optionList.valueMapId &&
            optionListId?.optionListValueMaps.find(({ id }) => id === optionList.valueMapId);
        const selectOptions: ISelectItem[] = [];
        if (valuesMapItem) {
            valuesMapItem.valuesMap.forEach(({ key }, id) =>
                selectOptions.push({
                    value: id,
                    label: key,
                }),
            );
        }
        correctAnswerField = (
            <MSTFormSelect
                MSTForm={question}
                path="/correctAnswer"
                labelMsg="correct-answer"
                options={selectOptions}
                isLoading={optionListLoading}
            />
        );
    }

    const maxCharactersField = (
        <MSTFormInput
            MSTForm={question}
            path="/maxLength"
            labelMsg="maximum-characters"
            type="number"
            step="1"
            min="1"
        />
    );
    const numberOfLinesField = (
        <MSTFormInput
            MSTForm={question}
            path="/lines"
            labelMsg="number-of-lines"
            type="number"
            step="1"
            max="20"
            min="1"
        />
    );

    let additionalFields = maxCharactersField;

    if (displayType === 1) {
        additionalFields = (
            <FormGroup row={true}>
                <Col sm="5">
                    <MSTFormSelect
                        MSTForm={question}
                        path="/inputFormat"
                        labelMsg="format"
                        options={inputFormatOptions}
                    />
                </Col>
                <Col>{maxCharactersField}</Col>
                <Col>{numberOfLinesField}</Col>
            </FormGroup>
        );
    } else if (displayType === 2) {
        additionalFields = (
            <FormGroup row={true}>
                <Col>{maxCharactersField}</Col>
                <Col>{numberOfLinesField}</Col>
            </FormGroup>
        );
    } else if (displayType === 4 || (displayType === 1 && inputFormat === 6)) {
        additionalFields = <MSTFormInput MSTForm={question} path="/mask" labelMsg="mask" />;
    } else if ([3, 5, 6, 7].includes(displayType)) {
        const optionListOptions = optionListArray.map(({ id, name }) => ({ value: id, label: name }));
        const valuesMapOptions = optionListId?.optionListValueMaps?.map(({ id, name }) => ({ value: id, label: name }));
        additionalFields = (
            <FormGroup row={true}>
                <Col sm="8">
                    <MSTFormSelect
                        key={optionListId?.id}
                        MSTForm={question}
                        path="/optionListId"
                        labelMsg="option-list"
                        options={optionListOptions}
                        value={optionListId?.id}
                        isLoading={optionListLoading}
                    />
                </Col>
                <Col>
                    <MSTFormSelect
                        MSTForm={question}
                        path="/optionList/valueMapId"
                        labelMsg="values-map"
                        options={valuesMapOptions}
                        isLoading={optionListLoading}
                    />
                </Col>
            </FormGroup>
        );
    }

    return (
        <>
            <MSTFormSelect MSTForm={question} path="/displayType" labelMsg="input-type" options={inputTypesOptions} />
            <MSTFormCustomInput
                MSTForm={question}
                path="/isRequired"
                labelMsg="required"
                type="checkbox"
                hideLabel={true}
                label="Required"
            />
            {question.canAddAdditionalInformation !== undefined && (
                <MSTFormCustomInput
                    MSTForm={question}
                    path="/canAddAdditionalInformation"
                    labelMsg="can-add-additional-info"
                    type="checkbox"
                    label="Can add additional info"
                    hideLabel={true}
                />
            )}
            {additionalFields}
            {correctAnswerField}
            <hr />
            <QuestionLanguagesForm question={question} selectedLanguageId={selectedLanguageId} />
        </>
    );
});
