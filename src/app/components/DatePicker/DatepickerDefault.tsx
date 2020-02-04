import * as React from 'react';
import 'flatpickr/dist/themes/airbnb.css';
import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';

export const DatepickerDefault = (props: DateTimePickerProps) => (
    <Flatpickr
        className="form-control"
        style={{minWidth: 100}}
        {...props}
    />
);
