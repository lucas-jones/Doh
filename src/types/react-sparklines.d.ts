declare module __ReactSparklines {
    export interface ISparklinesProps {
        data: number[];
        limit?: number;
        width?: number;
        height?: number;
        svgWidth?: number;
        svgHeight?: number;
        margin?: number;

        min?: number;

        max?: number;
    }

    export class Sparklines extends React.Component<ISparklinesProps, {}>{ }

    export class SparklinesLine extends React.Component<{ color?: string, style?: any }, {}>{ }
    
    export class SparklinesCurve extends React.Component<{ color?: string, style?: any }, {}>{ }

    export class SparklinesReferenceLine extends React.Component<{ type: string }, {}>{ }

    export class SparklinesNormalBand extends React.Component<{}, {}>{ }

    export class SparklinesSpots extends React.Component<{ style?: any }, {}>{ }

    export class SparklinesBars extends React.Component<{}, {}>{ }



    export class SparklinesText extends React.Component<{ text?: string, point?:{ x:number, y:number}, fontSize?:string, fontFamily?:string }, {}>{ }
}

declare module "react-sparklines" {
    export = __ReactSparklines;
}