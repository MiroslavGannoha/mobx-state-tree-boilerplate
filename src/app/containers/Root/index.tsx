import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react';

export const RootContainer = observer((props) => {
    return (
        <div>
            {props.children}
            <ToastContainer hideProgressBar={true} />
        </div>
    );
});
