import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import {
    Form,
    Button,
} from 'reactstrap';
import { IMSTForm } from 'app/models/MSTForm';

export interface IProps extends RouteComponentProps {
    MSTForm: IMSTForm;
    onValid: () => void;
    onInvalid?: () => void;
    children: React.ReactNodeArray;
}

export const MSTFormContainer = withRouter(observer((props: IProps) => {
    const {MSTForm, onValid, onInvalid, history, children} = props;
    const onSubmit = (e) => {
        e.preventDefault();
        MSTForm.submit()
            .catch(() => onInvalid && onInvalid())
            .then(onValid);
    };
    return (
        <Form className="form-horizontal" onSubmit={onSubmit}>
            {children}
            <div className="form-actions text-right">
                <Button color="secondary" onClick={history.goBack} size="sm">
                    Cancel
                </Button>
                <Button type="submit" color="primary" className="ml-3" size="sm">
                    Submit
                </Button>
            </div>
        </Form>
    );
}));

export default MSTFormContainer;