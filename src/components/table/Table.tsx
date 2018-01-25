import * as React from 'react';
import * as Reactstrap from 'reactstrap';
import * as CC from 'cryptocompare-api'
import App from '../../components/App'
import Entry from './Entry';

interface TableEntry {
	name:string;
	price:number;
	change:number;
	data:any;
}

interface State
{
	data: TableEntry[]
}

export default class Table extends React.Component<{}, State>
{
	constructor(props:{})
	{
		super(props);
		
		this.state = {
			data: []
		};
	}

	async componentDidMount()
	{
		const priceData = await CC.getPriceMultiFull({ fsyms: App.WATCH, tsyms: [ App.CURRENCY ] });

		var entries:TableEntry[] = [];

		for(var symbol of App.WATCH)
		{
			entries.push({
				name: symbol,
				price: parseFloat(priceData.RAW[symbol][App.CURRENCY].PRICE.toString()),
				change: parseFloat(priceData.RAW[symbol][App.CURRENCY].CHANGEPCT24HOUR.toFixed(2)),
				data: []
			});
		}
		
		this.setState({
			data: entries
		})
	}

	render()
	{
		console.log(this.state.data)
		return (
			<Reactstrap.Table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Price</th>
						<th>Change 24HR</th>
						<th>Change Month</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.data.map((data, index) => <Entry key={index} symbol={data.name} price={data.price} change={data.change} />)
				}
				</tbody>
			</Reactstrap.Table>
		);
	}
}