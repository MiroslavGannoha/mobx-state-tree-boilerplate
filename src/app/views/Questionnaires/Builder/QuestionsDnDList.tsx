import * as React from 'react';
import { observer } from 'mobx-react';
import { BuilderQuestionDnDItem } from './BuilderQuestionnaireQuestion';

export const QuestionsDnDList = observer(({ questions, provided, langId, onEdit, onDelete }) =>
    questions?.map((item, index) => (
        <BuilderQuestionDnDItem
            question={item}
            index={index}
            key={item.id + '-' + item.questionnaireId}
            selectedLanguageId={langId}
            provided={provided}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    )),
);