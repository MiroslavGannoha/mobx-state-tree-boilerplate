import * as React from 'react';

export const useAsyncAction = (asyncCall, successCallback?): [null | any, boolean, string | null, () => void] => {
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState(null);
    const [refreshCounter, setRefreshCounter] = React.useState(0);
    const refresh = () => setRefreshCounter(refreshCounter + 1);
    React.useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setPending(true);
            try {
                const result = await asyncCall();
                setData(result);
                successCallback && successCallback(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setPending(false);
            }
        };
        fetchData();
    }, [refreshCounter]);
    return [data, pending, error, refresh];
};
