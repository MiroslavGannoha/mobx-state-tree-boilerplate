import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTPhone, { IMSTPhoneProps } from './MSTPhone';

interface IProps extends IMSTFormControlWrapperProps, IMSTPhoneProps {}

export const MSTFormPhone = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, hideLabel, ...controlProps
    } = props;

    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};
    const phoneProps = {MSTForm, path, ...controlProps};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <MSTPhone {...phoneProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormPhone;
