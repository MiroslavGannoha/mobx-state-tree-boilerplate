import * as React from 'react';
import { observer } from 'mobx-react';
import ViewHeader from 'app/components/ViewHeader';
import Note from './Note';
import { SpinnerInCard } from 'app/components/Spinner';
import { ICHNote } from 'app/stores/CommunicationHistoryStore/models';
import { Button, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import TextEditor from 'app/components/TextEditor';
import { NoDataAvailable } from 'app/components/NoDataAvailable';
import { IRelatedCommHistoryStore } from 'app/stores/CommunicationHistoryStore';
import { documentTypes } from 'app/constants/documentTypes';

interface IProps {
    store: IRelatedCommHistoryStore;
    notesContainerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

export const NotesWidgetItemsList = observer(({ notes, onCopy }) => notes.map((note) => (
    <Note note={note} key={note.id} onCopy={onCopy} />
)));

const NotesWidget = observer(({store: commHistoryStore, notesContainerProps}: IProps) => {
    const [newNoteContent, setNewNoteContent] = React.useState<string | null | undefined>(null);
    const [createLoading, setCreateLoading] = React.useState(false);
    const {relatedDocumentType, documentId, loading, notes} = commHistoryStore;

    React.useEffect(() => {
        documentId && commHistoryStore.fetchAllRelated({type: documentTypes.Note});
    }, [documentId]);

    const onCopy = (note: ICHNote) => {
        setNewNoteContent(note?.details?.content);
        window.scrollTo(0, 0);
    };

    const addNote = () => {
        setNewNoteContent('');
    };

    const cancel = () => {
        setNewNoteContent(null);
    };

    const save = () => {
        setCreateLoading(true);
        commHistoryStore.collection.createItem({
            type: 1,
            details: {
                content: newNoteContent,
            },
            relatedDocuments: [
                {
                    documentType: relatedDocumentType,
                    id: documentId,
                },
            ],
        }).then(({id}) => {
            setNewNoteContent(null);
            setCreateLoading(false);
            commHistoryStore.applyPatch({path: '/items/0', op: 'add', value: id});
        }).catch(() => {
            setCreateLoading(false);
        });
    };

    const newNote = createLoading ? (
        <SpinnerInCard containerClass="mb-3"/>
    ) : (
        <Card className="shadow-sm mb-3">
            <CardHeader className="bg-white">
                <FormattedMsg id="new-note" />
            </CardHeader>
            <CardBody>
                <TextEditor value={newNoteContent} onEditorChange={setNewNoteContent} />
            </CardBody>
            <CardFooter className="bg-white text-right">
                <Button size="sm" className="mr-1" onClick={cancel}>
                    <i className="fas fa-times mr-2" />
                    <FormattedMsg id="cancel" />
                </Button>
                <Button size="sm" className="mr-1" onClick={save} color="primary">
                    <i className="far fa-save mr-2" />
                    <FormattedMsg id="save" />
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <>
            <ViewHeader tag="h4" titleKey="notes" iconClass="fas fa-comment-alt" >
                <Button onClick={addNote} size="sm" color="primary">
                    <i className="fas fa-plus mr-2" />
                    <FormattedMsg id="add" />
                </Button>
            </ViewHeader>
            <div {...notesContainerProps}>
                {newNoteContent === null ? null : newNote}
                {notes.length < 1 && !loading ? <NoDataAvailable /> : null}
                {loading ? <SpinnerInCard /> : <NotesWidgetItemsList notes={notes} onCopy={onCopy} />}
            </div>
        </>
    );
});

export default NotesWidget;
