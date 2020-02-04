import * as React from 'react';
import { FormGroup, Label, FormFeedback, InputProps, Col } from 'reactstrap';
import { observer } from 'mobx-react';
import * as Validator from 'validatorjs';
import { tryResolve, onPatch } from 'mobx-state-tree';
import { IMSTFormBaseProps } from './MSTFormInput/MSTInput';

export interface IMSTFormControlWrapperProps extends IMSTFormBaseProps {
    labelMsg: string;
    rules?: string | Array<string | Validator.TypeCheckingRule>;
    hideLabel?: boolean;
    hidden?: boolean;
    controlFirst?: boolean;
    horizontal?: boolean;
}

export const MSTFormControlWrapper = observer((props: IMSTFormControlWrapperProps & InputProps) => {
    const { MSTForm, path, labelMsg, rules, hideLabel, children, hidden, controlFirst, horizontal } = props;

    const [localValue, setValue] = React.useState(tryResolve(MSTForm, path));
    React.useEffect(() => {
        setValue(tryResolve(MSTForm, path));
        return onPatch(MSTForm, (patch) => patch.path === path && setValue(patch.value));
    }, [path, MSTForm]);

    const labelText = labelMsg;
    const validation = rules ? new Validator({ [labelText]: localValue }, { [labelText]: rules }) : null;

    const isInvalid = validation ? validation.fails() : false;
    MSTForm.updateInvalidPath(path, isInvalid);

    if (hidden) {
        return null;
    }

    const ErrorMsg = observer(() => {
        if (rules && MSTForm.errorsShown) {
            return (
                <FormFeedback valid={false} className={isInvalid ? 'd-block' : ''}>
                    {validation && validation.errors.first(labelText)}
                </FormFeedback>
            );
        }

        return null;
    });

    if (horizontal) {
        return (
            <FormGroup row={true}>
                <Col md="3" className="d-flex align-items-center">
                    {!hideLabel && (
                        <Label className="mb-0">{labelMsg}</Label>
                    )}
                </Col>
                <Col xs="12" md="9">
                    {children}
                    <ErrorMsg />
                </Col>
            </FormGroup>
        );
    } else {
        return (
            <FormGroup>
                {controlFirst ? children : null}
                {!hideLabel && (
                    <Label>{labelMsg}</Label>
                )}
                {controlFirst ? null : children}
                <ErrorMsg />
            </FormGroup>
        );
    }
});

export default MSTFormControlWrapper;
