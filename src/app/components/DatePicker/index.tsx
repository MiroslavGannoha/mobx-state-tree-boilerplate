import * as React from 'react';
import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

export * from './DatepickerDefault';
export * from './DatepickerSingle';

interface IProps extends DateTimePickerProps {
    value: string | number;
    disabled?: boolean;
    noCalendar?: boolean;
}

interface IState {
    focused: boolean;
}

export class DatePicker extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);

        this.state = {
            focused: false,
        };
    }

    public render() {
        const {noCalendar, children, ...restProps} = this.props;
        return (
            <Flatpickr
                data-no-calendar={this.props.noCalendar}
                className="form-control"
                {...restProps}
            />
        );
    }
}

export const TimePicker = (props) => (
    <Flatpickr
        data-enable-time={true}
        data-no-calendar={true}
        data-date-format="h:i"
        data-time_24hr={false}
        className="form-control"
        {...props}
    />
);
