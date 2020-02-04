import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { IRootStore } from '../../../stores';
import { yesNoRender, dateRender } from '../../../components/Table';
import {
    Row,
    Col,
    Card,
    CardBody,
} from 'reactstrap';
import { RoleRestriction } from '../../../components/RoleRestriction';
import DetailsViewDecorator, { IDetailsViewDecoratorProps } from 'app/decorators/CRUD/DetailsViewDecorator';
import ViewContainer from 'app/components/ViewContainer';
import ViewHeader from 'app/components/ViewHeader';
import KeyValueTable from 'app/components/KeyValueTable';
import CardHeaderDetails from 'app/components/CardHeaderDetails';
import { getFullName } from 'app/utils';

@inject(({ questionnairesStore, specsStore }: IRootStore) => ({ store: questionnairesStore, specsStore }))
@DetailsViewDecorator
@observer
class QuestionnaireDetails extends React.Component<IDetailsViewDecoratorProps> {

    public render() {
        const { item, editBtn, cancelBtn, deleteBtn, specsStore } = this.props;

        const {
            modified,
            created,
            name,
            template,
            published,
            isAutoNumbering,
            questionnaireType,
            personaId,
            status,
            filledByStaff,
            filledBy,
            sentToClient,
        } = item;

        const fields = [
            { label: 'name', value: name },
            { label: 'template', value: yesNoRender(template) },
            { label: 'published', value: yesNoRender(published) },
            { label: 'is-auto-numbering', value: yesNoRender(isAutoNumbering) },
            { label: 'type', value: specsStore.findLabelByValue('Questionnaire/questionnaireType', questionnaireType) },
            { label: 'persona', value: getFullName(personaId) },
            { label: 'status', value: specsStore.findLabelByValue('Questionnaire/status', status) },
            { label: 'filled-by-staff', value: yesNoRender(filledByStaff) },
            { label: 'filled-by', value: filledBy },
            { label: 'sent-to-client', value: dateRender(sentToClient) },
        ];

        const isForm = questionnaireType === 1;
        const controls = (
            <RoleRestriction allowedRoles={['Staff']}>
                {editBtn}
                {deleteBtn}
            </RoleRestriction>
        );

        return (
            <ViewContainer>
                <ViewHeader titleKey="questionnaire-details">
                    {isForm && controls}
                    <span className="ml-2">
                        {cancelBtn}
                    </span>
                </ViewHeader>
                <Card>
                    <CardHeaderDetails created={created} modified={modified} />
                    <CardBody>
                        <Row>
                            <Col>
                                <KeyValueTable fields={fields} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ViewContainer>
        );
    }
}

export default QuestionnaireDetails;
