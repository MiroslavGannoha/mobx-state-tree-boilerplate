/** Global definitions for developement **/

// for style loader
declare module '*.css' {
    const styles: unknown;
    export = styles;
}

declare module '*.jpg';
declare module '*.png';

declare module '*.json' {
    const value: unknown;
    export default value;
}

declare const API_URL: string;

type obj = {
    [P in string]: unknown;
};
type stringNumberObj = {
    [P in string]: string | number;
};

type RouteParams = {
    [paramName: string]: string | number | boolean
};
