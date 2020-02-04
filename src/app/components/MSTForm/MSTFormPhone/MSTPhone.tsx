import * as React from 'react';
import metadata from 'libphonenumber-js/metadata.min.json';
import { InputProps } from 'reactstrap';
import { observer } from 'mobx-react';
import PhoneInput from 'react-phone-number-input/react-responsive-ui';
import { parsePhoneNumberFromString, Metadata } from 'libphonenumber-js/core';
import { IMSTFormBaseProps } from '../MSTFormInput/MSTInput';
import 'react-phone-number-input/style.css';
import 'react-responsive-ui/style.css';

export interface IMSTPhoneProps extends InputProps, IMSTFormBaseProps {}

export const MSTPhone = observer(
    ({ MSTForm, path, ...inputProps }: IMSTPhoneProps) => {
        // const [phoneData, setPhoneData] = React.useState(resolvePath(MSTForm, path));
        // onPatch(MSTForm, (patch) => patch.path === path && setPhoneData(patch.value));

        const onChange = (value) => {
            if (value) {
                const data = parsePhoneNumberFromString(value, metadata as Metadata);
                if (data) {
                    MSTForm.patchPath(path + '/number', data.number);
                    MSTForm.patchPath(path + '/nationalNumber', data.nationalNumber);
                    MSTForm.patchPath(path + '/countryCode', data.countryCallingCode);
                    MSTForm.patchPath(path + '/countryName', data.country);
    
                    return;
                }
            }


            MSTForm.patchPath(path + '/number', value);
        };

        return (
            <PhoneInput
                className="custom-mobile-input"
                inputClassName={MSTForm.invalidPaths.has(path) && MSTForm.errorsShown ? 'is-invalid' : ''}
                onChange={onChange}
                country="US"
                invalid={String(MSTForm.invalidPaths.has(path) && MSTForm.errorsShown)}
                {...inputProps}
            />
        );
    },
);

export default MSTPhone;
