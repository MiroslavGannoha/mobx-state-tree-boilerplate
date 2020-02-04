import * as React from 'react';
import { observer } from 'mobx-react';
import { resolvePath, onPatch } from 'mobx-state-tree';
import { DatepickerSingle, IDatepickerSingleProps } from '../../DatePicker';
import { IMSTFormBaseProps } from '../MSTFormInput/MSTInput';

export interface IMSTDatepickerProps extends IDatepickerSingleProps, IMSTFormBaseProps {
    ISOStringValue?: boolean;
}

export const MSTDatepicker = observer((props: IMSTDatepickerProps) => {
    const {MSTForm, path, ISOStringValue, ...datepickerProps} = props;

    const [localValue, setLocalValue] = React.useState(resolvePath(MSTForm, path));
    onPatch(MSTForm, (patch) => patch.path === path && setLocalValue(patch.value));

    function onChangeLocal (date: Date) {
        MSTForm.patchPath(path, ISOStringValue ? date.toISOString() : date);
    }

    return (
        <DatepickerSingle
            value={localValue}
            onChange={onChangeLocal}
            {...datepickerProps}
        />
    );
});

export default MSTDatepicker;
