import * as React from 'react';
import { DateTimePickerProps } from 'react-flatpickr';
import { DatepickerDefault } from './';
import { Instance } from 'flatpickr/dist/types/instance';

export interface IDatepickerSingleProps extends DateTimePickerProps {
    onChange?: (date: Date, currentDateString: string, self: Instance, data?: any) => void;
}

export const DatepickerSingle = ({ value, onChange, ...otherProps }: IDatepickerSingleProps) => (
    <DatepickerDefault
        value={value}
        onChange={onChange && (([d], ...other) => onChange(d, ...other))}
        {...otherProps}
    />
);
