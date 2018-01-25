import * as React from 'react';
import * as CC from 'cryptocompare-api'
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import App from '../../components/App'
import Utils from '../../utils/Utils'

interface Props
{
	symbol:string;
	price:number;
	change:number;
}

interface State
{
	history:any;
}

export default class Entry extends React.Component<Props, State>
{
	constructor(props:Props)
	{
		super(props);

		this.state = {
			history: []
		};
	}

	async componentWillMount()
	{
		var data = await CC.getHistoricalDays({ fsym: this.props.symbol, tsym: App.CURRENCY });
		
		this.setState({
			history: data.Data
		});
	}

	render()
	{	
		const gen = (data:any[]) => {
			return data.map((a) => a.low);
		};

		return (
			<tr >
				<th scope="row">{ this.props.symbol }</th>
				<td>£{ Utils.formatPrice(this.props.price) }</td>
				<td style={{ color: Utils.formatPercent(this.props.change) }}>{ this.props.change }%</td>
				<td style={{ width: '30%', height: '70px' }}>
					{
						<Sparklines data={gen(this.state.history)} limit={this.state.history.length} width={200} height={40} >
							<SparklinesCurve style={{ strokeWidth: 0.7, fill: 'none' }} />
						</Sparklines>
					}
				</td>
			</tr>
		);
	}
}