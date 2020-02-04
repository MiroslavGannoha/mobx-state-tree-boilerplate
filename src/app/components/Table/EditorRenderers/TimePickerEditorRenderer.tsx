import * as React from 'react';
import { TimePicker } from 'app/components/DatePicker';

interface IProps {
    value: number;
    onUpdate: (val: string) => void;
}

class TimePickerEditorRender extends React.Component<IProps> {

    public val = null;

    public getValue() {
        return this.val;
    }

    public render() {
        const { value, onUpdate } = this.props;
        const onChange = ([date]) => {
            if (!date) { return; }
            this.val = date.toISOString();
            onUpdate(date.toISOString());
        };
        return <TimePicker value={value}  onChange={onChange} />;
    }
}

export default TimePickerEditorRender;
