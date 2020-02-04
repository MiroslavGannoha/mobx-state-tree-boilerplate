import * as React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button, Row, Col } from 'reactstrap';
import { getFullName, dayFromNowMessage } from 'app/utils';
import FormattedMsg from 'app/components/i18n/FormattedMsg';
import { observer } from 'mobx-react';
import TextEditor from 'app/components/TextEditor';
import { SpinnerInCard } from 'app/components/Spinner';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { ICHNote } from 'app/stores/CommunicationHistoryStore/models';
import { useRootStore, authStore } from 'app/stores';
import { StaffLink } from 'app/components/Personas/PersonaProfileLink/StaffLink';

const snapshots = {};
const contentSnapshots = (id) => {
    if (!snapshots[id]) {
        snapshots[id] = [];
    }

    return snapshots[id];
};

const { personaIncludesSomeRoles } = authStore;

const ClientNoteItem = observer(({ note, onCopy }: { note: ICHNote; onCopy: (note) => void }) => {
    const {
        usersStore: { authedUser },
    } = useRootStore();
    const [editMode, setEditMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const {
        created,
        createdById,
        modified,
        modifiedById,
        details: { content },
    } = note;

    function onCopyWrapper () { onCopy(note);}

    const edit = () => {
        setEditMode(true);
    };

    const removeItem = () => {
        setLoading(true);
        note.remove()
            .then(() => {
                note.destroy();
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const cancel = () => {
        setEditMode(false);
        const snapshots = contentSnapshots(note.id);
        if (snapshots.length > 0) {
            applySnapshot(note.details, snapshots[0]);
            snapshots.length = 1;
        }
    };

    const save = () => {
        const snapshots = contentSnapshots(note.id);
        setLoading(true);

        note.sync()
            .then(() => {
                snapshots.length = 1;
                snapshots[0] = getSnapshot(note.details);
                setLoading(false);
                setEditMode(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onEditorChange = (value) => {
        contentSnapshots(note.id).push(getSnapshot(note.details));
        note.applyPatch({
            path: '/details/content',
            op: 'replace',
            value,
        });
    };

    if (loading) {
        return <SpinnerInCard />;
    }

    const creatorRemoveButton =
        (createdById && (authedUser.id === createdById.id)) || personaIncludesSomeRoles(['Firm Admin']) ? (
            <Button size="sm" onClick={removeItem} className="mr-1">
                <i className="fas fa-trash-alt mr-2" />
                <FormattedMsg id="delete" />
            </Button>
        ) : null;

    const actions = editMode ? (
        <>
            <Button size="sm" className="mr-1" onClick={cancel}>
                <i className="fas fa-times mr-2" />
                <FormattedMsg id="cancel" />
            </Button>
            <Button size="sm" className="mr-1" onClick={save} color="primary">
                <i className="far fa-save mr-2" />
                <FormattedMsg id="save" />
            </Button>
        </>
    ) : (
        <>
            {creatorRemoveButton}
            <Button size="sm" className="mr-1" onClick={onCopyWrapper}>
                <i className="far fa-copy mr-2" />
                <FormattedMsg id="copy" />
            </Button>
            <Button size="sm" className="mr-1" onClick={edit}>
                <i className="fas fa-edit mr-2" />
                <FormattedMsg id="edit" />
            </Button>
        </>
    );

    const bodyContent = editMode ? (
        <TextEditor value={content} onEditorChange={onEditorChange} />
    ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
    );

    const createdMessage = dayFromNowMessage(created);
    const modifiedMessage = dayFromNowMessage(modified);
    const modifiedBy =
    (new Date(created)).toUTCString() !== (new Date(modified)).toUTCString() ? (
        <Col>
            <small>
                Modified By &nbsp;
                <StaffLink personaId={modifiedById?.id}>
                    {getFullName(modifiedById)}
                </StaffLink>
                &nbsp;
                {modifiedMessage}
            </small>
        </Col>
    ) : null;
    return (
        <Card className="shadow-sm mb-3">
            <CardHeader className="bg-white text-muted py-2 px-3">
                <Row>
                    <Col className="pr-0">
                        <small>
                            <FormattedMsg id="created-by" />
                            &nbsp;
                            <StaffLink personaId={createdById?.id}>
                                {getFullName(createdById)}
                            </StaffLink>
                            &nbsp;
                            {createdMessage}
                        </small>
                    </Col>
                    {modifiedBy}
                </Row>
            </CardHeader>
            <CardBody>{bodyContent}</CardBody>
            <CardFooter className="bg-white text-right p-1">{actions}</CardFooter>
        </Card>
    );
});

export default ClientNoteItem;
