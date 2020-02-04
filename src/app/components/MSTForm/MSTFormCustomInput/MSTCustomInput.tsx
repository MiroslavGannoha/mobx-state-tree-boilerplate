import * as React from 'react';
import {
    InputGroup,
    CustomInputProps,
    CustomInput,
} from 'reactstrap';
import { observer } from 'mobx-react';
import { resolvePath, IAnyStateTreeNode, onPatch } from 'mobx-state-tree';
import { IMSTForm } from 'app/models/MSTForm';

export interface IMSTFormBaseProps {
    MSTForm: IAnyStateTreeNode & IMSTForm;
    path: string;
}

export interface IMSTCustomInputProps extends IMSTFormBaseProps, CustomInputProps {}
export const MSTCustomInput = observer((props: IMSTCustomInputProps) => {
    const {
        MSTForm, path, ...inputProps
    } = props;

    const [localValue, setValue] = React.useState(resolvePath(MSTForm, path));
    onPatch(MSTForm, (patch) => patch.path === path && setValue(patch.value));

    const isCheckbox = inputProps.type === 'checkbox';
    const onNativeChange = ({ target: { value: targetValue, checked } }) => {
        MSTForm.patchPath(path, isCheckbox ? checked : targetValue);
    };
    const valueProp = isCheckbox ? {checked: localValue} : {value: localValue};

    return (
        <InputGroup>
            <CustomInput
                id={path}
                bsSize="lg"
                {...valueProp}
                onChange={onNativeChange}
                invalid={MSTForm.invalidPaths.has(path) && MSTForm.errorsShown}
                {...inputProps}
            />
        </InputGroup>
    );
});

export default MSTCustomInput;
