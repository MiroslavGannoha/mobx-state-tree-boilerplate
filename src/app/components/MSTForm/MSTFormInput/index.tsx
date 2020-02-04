import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTInput, { IMSTInputProps } from './MSTInput';

interface IProps extends IMSTFormControlWrapperProps, IMSTInputProps {}

export const MSTFormInput = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, prepend, append, hideLabel, horizontal, ...inputProps
    } = props;
    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel, horizontal};
    const mstInputProps = {MSTForm, path, prepend, append, ...inputProps};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <MSTInput {...mstInputProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormInput;
