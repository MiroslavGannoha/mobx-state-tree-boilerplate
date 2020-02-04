import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { createStores, IRootStore } from './app/stores/RootStore';
import App from './app';

// Import Font Awesome Icons Set
import '@fortawesome/fontawesome-free/css/all.css';
// Import Main styles for this application

// enable MobX strict mode
configure({ enforceActions: 'observed' });

// prepare MobX stores
const rootStore: IRootStore = createStores();

ReactDOM.render(<App rootStore={rootStore} />, document.getElementById('root'));
