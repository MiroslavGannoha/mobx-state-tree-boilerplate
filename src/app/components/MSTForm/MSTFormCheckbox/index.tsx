import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTCheckbox, { IMSTCheckboxProps }  from './MSTCheckbox';

interface IProps extends IMSTFormControlWrapperProps, IMSTCheckboxProps {}
export const MSTFormCheckbox = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, hideLabel, ...selectProps
    } = props;
    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};
    const controlProps = {MSTForm, path, ...selectProps};

    return (
        <MSTFormControlWrapper controlFirst={true} {...wrapperProps}>
            <MSTCheckbox {...controlProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormCheckbox;
