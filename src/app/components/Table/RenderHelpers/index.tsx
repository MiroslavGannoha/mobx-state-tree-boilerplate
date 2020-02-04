import * as React from 'react';
import { personaTypes } from '../../../constants/personaTypes';
import { getFullName, getTimeWith12h, getShortMonthDay } from '../../../utils';
import { Badge } from 'reactstrap';
import { FormattedDate } from 'react-intl';
import { timeEstimates } from 'app/constants/legalService';

export const avatarFieldRender = (imgUrl: string, { name }) => {
    return (
        <div className="avatar">
            <img className="img-avatar" src={imgUrl} alt={name} />
        </div>
    );
};
export const caretRender = (sortOrder) => {
    if (sortOrder === 'asc') {
        return <i className="fa fa-chevron-up" />;
    } else if (sortOrder === 'desc') {
        return <i className="fa fa-chevron-down" />;
    }
};

export const dateTimeRender = (date: string | undefined): React.ReactFragment =>
    date ? (
        <FormattedDate
            value={date}
            year="numeric"
            month="long"
            day="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
        />
    ) : (
        '-'
    );

export const dateRender = (date: string | Date | null): React.ReactFragment =>
    date ? <FormattedDate value={date} year="numeric" month="long" day="numeric" /> : '-';

export const publishedRender = (publishedStatus: string | boolean) =>
    publishedStatus ? (
        <Badge color="success">published</Badge>
    ) : (
        <Badge color="warning">not published</Badge>
    );

export const unpublishedRender = (publishedStatus: string | boolean) =>
    publishedStatus ? null : <Badge color="warning">not published</Badge>;

export const fullNameRender = (name, { firstName, middleName, lastName }) =>
    getFullName({ firstName, middleName, lastName });

export const personaTypesRender = (personaTypesindexes: number[]) =>
    personaTypesindexes && personaTypesindexes.length
        ? personaTypesindexes.map((index) => personaTypes[index]).join(', ')
        : '-';

export const emailsRender = (emails) => (emails && emails.length ? emails[0].address : '-');

export const addressRender = (addresses) =>
    addresses && addresses.length ? addresses[0].address : '-';

export const langContentRender = (lContent) =>
    lContent && lContent.length ? `${lContent[0].title}` : '-';
export const langContentItemRender = (lContentItem) =>
    lContentItem && lContentItem.languageContent && lContentItem.languageContent.length
        ? `${lContentItem.languageContent[0].title}`
        : '-';

export const yesNoRender = (trueOrFalse: boolean) =>
    trueOrFalse ? (
        <i className="fa fa-check text-success ml-2" />
    ) : (
        <i className="fa fa-times text-gray-300 ml-2" />
    );

export const yesNoRedRender = (trueOrFalse: boolean) =>
    trueOrFalse ? (
        <i className="fa fa-check text-danger ml-2" />
    ) : (
        <i className="fa fa-times text-gray-300 ml-2" />
    );

export const timeEstimateRender = (estimatedCompletion) =>
    estimatedCompletion.type === 0
        ? timeEstimates[0]
        : `${estimatedCompletion.value} ${timeEstimates[estimatedCompletion.type]}(s)`;

export const startEndTimeRender = (start: string, { end }): React.ReactFragment => {
    const formattedDay = getShortMonthDay(end);
    const formattedStart = getTimeWith12h(start);
    const formattedEnd = getTimeWith12h(end);

    return (
        <>
            <div>{formattedDay}</div>

            <div>{`${formattedStart} - ${formattedEnd}`}</div>
        </>
    );
};

export const consultationTypeRender = (consultationTypeName, { meetingType }) => (
    <>
        <div>{consultationTypeName}</div>

        <small>Consultation Location: {meetingType.name}</small>
    </>
);
