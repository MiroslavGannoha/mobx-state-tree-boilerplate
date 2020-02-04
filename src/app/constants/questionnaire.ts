export const inputTypes = [
    '',
    'Text Box',
    'Text Area',
    'Radio Button',
    'Multi Text Box',
    'Dropdown Multiselect',
    'Dropdown',
    'Checkbox',
];
export const inputFormats = [
    '',
    'Text',
    'Date',
    'Number',
    'Email',
    'Phone Number',
    'Mask',
    'Editor',
];

export const inputTypesOptions = inputTypes.filter((v) => !!v).map((label, index) => ({label, value: index + 1}));
export const inputFormatOptions = inputFormats.filter((v) => !!v).map((label, index) => ({label, value: index + 1}));