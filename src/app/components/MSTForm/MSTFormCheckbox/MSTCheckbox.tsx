import * as React from 'react';
import { observer } from 'mobx-react';
import { resolvePath, onPatch } from 'mobx-state-tree';
import Switcher from 'app/components/Switcher';
import { IMSTFormBaseProps } from '../MSTFormInput/MSTInput';
import { InputProps } from 'reactstrap';


export interface IMSTCheckboxProps extends IMSTFormBaseProps, InputProps {}
export const MSTCheckbox = observer((props: IMSTCheckboxProps) => {
    const {
        MSTForm, path, ...inputProps
    } = props;

    const [localValue, setValue] = React.useState(resolvePath(MSTForm, path));
    onPatch(MSTForm, (patch) => patch.path === path && setValue(patch.value));

    const onNativeChange = ({ target: { checked } }) => {
        MSTForm.patchPath(path, checked);
    };

    return (
        <Switcher
            id={path}
            checked={localValue}
            onChange={onNativeChange}
            className="mr-2"
            {...inputProps}
        />
    );
});

export default MSTCheckbox;
