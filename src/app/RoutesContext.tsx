import * as React from 'react';

export const RoutesContext = React.createContext([]);
export const useRoutes = () => React.useContext(RoutesContext);
