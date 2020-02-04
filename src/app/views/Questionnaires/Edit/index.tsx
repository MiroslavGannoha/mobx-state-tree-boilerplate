import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IRootStore } from '../../../stores';
import {
    Card,
    CardBody,
} from 'reactstrap';
import { FormContent } from '../Form';
import EditViewDecorator, { IEditViewDecoratorProps } from 'app/decorators/CRUD/EditViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import FormattedMsg from '../../../components/i18n/FormattedMsg';

@inject(({ questionnairesStore }: IRootStore) => ({ store: questionnairesStore }))
@EditViewDecorator
@observer
class EditQuestionnaire extends React.Component<IEditViewDecoratorProps> {

    public render() {
        const { onFormValid, store: { editStore: {item} } } = this.props;

        return (
            <ViewContainer>
                <h3 className="mb-3">
                    <FormattedMsg id="edit-questionnaire" />
                </h3>
                <Card>
                    <CardBody>
                        <FormContent data={item} onFormValid={onFormValid} />
                    </CardBody>
                </Card>
            </ViewContainer>
        );
    }
}

export default EditQuestionnaire;
