import * as React from 'react';
import { observer, inject } from 'mobx-react';
import MobxReactForm from 'mobx-react-form';
import { MobxForm } from '../../../stores/Utils';
import { formFields } from './formFields';
import {
    FormContentWrapper, CustomFormGroup, CustomSelectFormGroup,
} from 'app/components/Form';
import { LegalService, IRootStore } from 'app/stores';
import { SnapshotOrInstance } from 'mobx-state-tree';
import { ISpecsStore } from 'app/stores/SpecsStore';
import { IMeetingTypesStore } from 'app/stores/MeetingTypesStore';

interface IProps {
    onFormValid: (form: unknown) => void;
    data?: SnapshotOrInstance<typeof LegalService>;
    specsStore?: ISpecsStore;
    meetingTypesStore?: IMeetingTypesStore;
}

@inject(({ specsStore }: IRootStore) => ({ specsStore }))
@observer
export class FormContent extends React.Component<IProps> {

    private form: MobxReactForm = null;

    public componentWillMount() {
        const { onFormValid, data } = this.props;
        this.form = new MobxForm(formFields, onFormValid);
        if (data) {
            const updatedData = { ...data };
            this.form.update(updatedData);
        }
    }

    public render() {
        const { specsStore } = this.props;
        const form = this.form;
        return (
            <FormContentWrapper form={form}>
                <CustomFormGroup field={form.$('name')} />
                <CustomSelectFormGroup
                    field={form.$('questionnaireType')}
                    options={specsStore && specsStore.getSelectList('Questionnaire/questionnaireType')}
                    defaultValueIndex={0}
                />
            </FormContentWrapper>
        );
    }
}
