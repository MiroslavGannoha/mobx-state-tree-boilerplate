import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IRootStore } from '../../../stores';
import {
    CardBody,
    Card,
} from 'reactstrap';
import { FormContent } from '../Form';
import CreateViewDecorator, { ICreateViewDecoratorProps } from 'app/decorators/CRUD/CreateViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import FormattedMsg from 'app/components/i18n/FormattedMsg';

@inject(({ questionnairesStore }: IRootStore) => ({ store: questionnairesStore }))
@CreateViewDecorator
@observer
class CreateQuestionnaire extends React.Component<ICreateViewDecoratorProps> {
    public render() {
        const { onFormValid } = this.props;

        return (
            <ViewContainer>
                <h3 className="mb-3">
                    <FormattedMsg id="create-questionnaire" />
                </h3>
                <Card>
                    <CardBody>
                        <FormContent onFormValid={onFormValid} />
                    </CardBody>
                </Card>
            </ViewContainer>
        );
    }

}

export default CreateQuestionnaire;
