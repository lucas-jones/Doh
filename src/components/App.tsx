import * as React from 'react';
import './App.css';
import { Table, Container, Button } from 'reactstrap';
// import { Line } from 'react-chartjs-2';
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import * as QueryString from 'query-string';
import * as CC from 'cryptocompare-api'
import {Typeahead} from 'react-bootstrap-typeahead';

interface Props { }
interface State { data: Stock[]; available: any[] }

interface Stock {
	name:string;
	price:number;
	change:number;
	data:any;
}

class App extends React.Component<Props, State>
{
	static CURRENCY = "GBP";
	static WATCH = [ "BTC", "LTC", "ETH", "XRP", "IOT", "XRB","ENG", "REQ", "DOGE", "WABI" ];

	constructor(props:Props)
	{
		super(props);

		this.state = {
			data: [],
			available: []
		};
	}

	async getData()
	{
		var coins:any = QueryString.parse(location.search);

		var watch:string[] = coins.watch == null ? App.WATCH : coins.watch.split(',');

		const prices = await CC.getPriceMultiFull({ fsyms: watch, tsyms: [App.CURRENCY] });
		
		if(coins.watch != null)
		{
			history.pushState(null, "Doh", QueryString.stringify({ watch: watch.join(",")}, { encode: false } ));
		}

		var output:Stock[] = [];

		for(var symbol of watch)
		{
			var data = await CC.getHistoricalDays({ fsym: symbol, tsym: App.CURRENCY });

			output.push({
				name: symbol,
				price: parseFloat(prices.RAW[symbol][App.CURRENCY].PRICE.toString()),
				change: parseFloat(prices.RAW[symbol][App.CURRENCY].CHANGEPCT24HOUR.toFixed(2)),
				data: data.Data
			});
		}
		
		return output;
	}

	async componentDidMount()
	{
		const data = await this.getData();
		const avil = await CC.getCoinList();

		this.setState({
			data,
			available: Object.keys(avil.Data).map((symbol) => avil.Data[symbol])
		});
	}

	addCoin(coin:any)
	{
		console.log(coin);
	}

	render()
	{
		const formatPercent = (value:number) => {
			return { color: value > 0 ? 'green' : 'red' };
		}

		const gen = (data:any[]) => {
			return data.map((a) => a.low);
		};

		const formatPrice = (price:number) => {
			let result:string = "N/A";

			if(price < 0.01) result = price.toFixed(4)
			else if(price < 1) result = price.toFixed(2)
			else if(price < 10) result = price.toFixed(2)
			else if(price < 100) result = price.toFixed(2)
			else result = price.toFixed(0);

			return parseFloat(result).toLocaleString();
		};
		
		return (
			<div className="app">
				<img className="logo" src='/doh.svg' />
				<h1 className="display-1">Doh</h1>
				<br />
				
				<Container className="stuff" >
					<div className="search" >
						<Typeahead ref="typeahead" options={this.state.available} placeholder={"...."} labelKey="FullName" />
						<Button outline color="success" onClick={(coin) => this.addCoin(((window as any).apple  = this.refs.typeahead as any))} >Add</Button>
					</div>
					<Table  >
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
							this.state.data.map((data, index) => 
								<tr key={index} >
									<th scope="row">{data.name}</th>
									<td>£{formatPrice(data.price)}</td>
									<td style={formatPercent(data.change)} >{data.change}%</td>
									<td >
										<Sparklines data={gen(data.data)} limit={data.data.length} width={200} height={40} >
											<SparklinesCurve style={{ strokeWidth: 0.7, fill: "none" }} />
										</Sparklines>
									</td>
								</tr>
							)
						}
						
						</tbody>
					</Table>
				</Container>
			</div>
		);
	}
}

export default App;