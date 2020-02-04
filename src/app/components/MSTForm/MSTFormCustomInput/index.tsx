import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTCustomInput, { IMSTCustomInputProps } from './MSTCustomInput';

interface IProps extends IMSTFormControlWrapperProps, IMSTCustomInputProps {}

export const MSTFormCustomInput = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, hideLabel, ...inputProps
    } = props;
    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};
    const mstInputProps = {MSTForm, path, ...inputProps};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <MSTCustomInput {...mstInputProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormCustomInput;
