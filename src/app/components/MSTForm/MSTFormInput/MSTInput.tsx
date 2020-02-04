import * as React from 'react';
import {
    Input,
    InputProps,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';
import { observer } from 'mobx-react';
import { resolvePath, IAnyStateTreeNode, onPatch } from 'mobx-state-tree';
import { IMSTForm } from 'app/models/MSTForm';

export interface IMSTFormBaseProps {
    MSTForm: IAnyStateTreeNode & IMSTForm;
    path: string;
}

export interface IMSTInputProps extends IMSTFormBaseProps, InputProps {
    prepend?: string;
    append?: string;
}
export const MSTInput = observer((props: IMSTInputProps) => {
    const {
        MSTForm, path, prepend, append, ...inputProps
    } = props;

    const [localValue, setValue] = React.useState(resolvePath(MSTForm, path));
    React.useEffect(() => {
        setValue(resolvePath(MSTForm, path));
        return onPatch(MSTForm, (patch) => {
            patch.path === path && setValue(patch.value);
        });
    }, [path, MSTForm]);
    const isNumber = inputProps.type === 'number';
    const onNativeChange = function ({ target: { value: targetValue } }) {
        MSTForm.patchPath(path, isNumber ? parseInt(targetValue, 10) : targetValue);
    };

    return (
        <InputGroup>
            {prepend ? <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon> : null}
            <Input
                value={localValue || ''}
                onChange={onNativeChange}
                invalid={MSTForm.invalidPaths.has(path) && MSTForm.errorsShown}
                {...inputProps}
            />
            {append ? <InputGroupAddon addonType="append">{append}</InputGroupAddon> : null}
        </InputGroup>
    );
});

export default MSTInput;
