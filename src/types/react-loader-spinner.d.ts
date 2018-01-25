declare module ReactLoaderSpinner {
    export interface ISparklinesProps {
        type:string;
        height?:string;
        width?:string;
        color?:string;
    }

    export class Loader extends React.Component<ISparklinesProps, {}>{ }
}

declare module "react-loader-spinner" {
    export default ReactLoaderSpinner.Loader;
}