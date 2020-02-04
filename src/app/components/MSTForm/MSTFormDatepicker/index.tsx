import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTDatepicker, { IMSTDatepickerProps } from './MSTDatepicker';

interface IProps extends IMSTFormControlWrapperProps, IMSTDatepickerProps {}

export const MSTFormDatepicker = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, hideLabel, ...datepickerProps
    } = props;

    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};
    const mstDatepickerProps = {MSTForm, path, ...datepickerProps};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <MSTDatepicker {...mstDatepickerProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormDatepicker;
