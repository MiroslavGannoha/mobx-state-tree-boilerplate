import * as React from 'react';
import { observer } from 'mobx-react';
import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from '../MSTFormControlWrapper';
import MSTSelect, { IMSTSelectProps } from './MSTSelect';

interface IProps extends IMSTFormControlWrapperProps, IMSTSelectProps {}
export const MSTFormSelect = observer((props: IProps) => {
    const {
        MSTForm, path, labelMsg, rules, hideLabel, ...selectProps
    } = props;
    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};
    const controlProps = {MSTForm, path, ...selectProps};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <MSTSelect {...controlProps} />
        </MSTFormControlWrapper>
    );
});

export default MSTFormSelect;
