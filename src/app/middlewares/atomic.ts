import {
    createActionTrackingMiddleware2,
    recordPatches,
    IPatchRecorder,
    isActionContextThisOrChildOf,
} from 'mobx-state-tree';

const atomic = createActionTrackingMiddleware2<{ recorder: IPatchRecorder }>({
    filter(call) {
        // only call the methods above for actions that were not being recorded,
        // but do not call them for child acions (which inherit a copy of the env)
        if (call.env) {
            // already recording
            return false;
        }

        return true;
    },
    onStart(call) {
        const recorder = recordPatches(call.tree, (patch, inversePatch, actionContext) => {
            // only record patches that were generated by this action or children of this action
            return !!actionContext && isActionContextThisOrChildOf(actionContext, call.id);
        });
        recorder.resume();
        call.env = {
            recorder,
        };
    },
    onFinish(call, error) {
        const recorder = call.env!.recorder;
        call.env = undefined;
        recorder.stop();

        if (error !== undefined) {
            recorder.undo();
        }
    },
});

export default atomic;