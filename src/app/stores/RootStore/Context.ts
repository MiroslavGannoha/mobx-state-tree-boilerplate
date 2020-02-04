import * as React from 'react';
import { MobXProviderContext } from 'mobx-react';
// import { IRootStore } from './';

export const useRootStore = (): any /* IRootStore */ => React.useContext(MobXProviderContext);

