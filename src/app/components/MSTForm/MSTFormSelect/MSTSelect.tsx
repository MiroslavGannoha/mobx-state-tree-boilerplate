import * as React from 'react';
import { observer } from 'mobx-react';
import { tryResolve, onPatch } from 'mobx-state-tree';
import { ISelectDefaultProps } from 'app/components/ReactSelect/SelectDefault';
import { SelectSimpleValue } from 'app/components/ReactSelect';

import { IMSTFormBaseProps } from '../MSTFormInput/MSTInput';

export interface IMSTSelectProps extends ISelectDefaultProps, IMSTFormBaseProps {
    ReactSelectComponent?: React.ReactType;
}

export const MSTSelect = observer((props: IMSTSelectProps) => {
    const {MSTForm, path, ReactSelectComponent, ...selectProps} = props;
    const {options, getOptionValue} = selectProps;
    const [localValue, setValue] = React.useState(tryResolve(MSTForm, path));

    React.useEffect(() => {
        if (options && options.length && (localValue === null || localValue === undefined)) {
            const defaultOption = options.find(({isDefault}) => isDefault);
            if (defaultOption) {
                MSTForm.patchPath(path, (getOptionValue ? getOptionValue(defaultOption) : defaultOption.value));
            }
        }
    }, [options]);

    onPatch(MSTForm, (patch) => patch.path === path && setValue(patch.value));
    function onChange (v) { MSTForm.patchPath(path, v); }

    const component = ReactSelectComponent ? (
        <ReactSelectComponent
            onChange={onChange}
            value={localValue}
            {...selectProps}
        />
    ) : (
        <SelectSimpleValue
            onChange={onChange}
            value={localValue}
            {...selectProps}
        />
    );
    return component;
});

export default MSTSelect;
