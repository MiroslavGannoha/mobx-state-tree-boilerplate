import * as React from 'react';
import { observer } from 'mobx-react';

import MSTFormControlWrapper, { IMSTFormControlWrapperProps } from 'app/components/MSTForm/MSTFormControlWrapper';

import TextEditor from 'app/components/TextEditor';

interface IProps extends  IMSTFormControlWrapperProps {
    value: string;
    onChange: (value: string) => void;
}

export const MSTEditor = observer((props: IProps) => {
    const { MSTForm, path, labelMsg, rules, hideLabel } = props;
    const wrapperProps = {MSTForm, path, labelMsg, rules, hideLabel};

    return (
        <MSTFormControlWrapper {...wrapperProps}>
            <TextEditor
                value={props.value}
                onEditorChange={props.onChange}
            />
        </MSTFormControlWrapper>
    );
});

export default MSTEditor;
