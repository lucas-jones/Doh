import * as React from 'react';
import './App.css';
import { Table, Container, Button } from 'reactstrap';
// import { Line } from 'react-chartjs-2';
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import * as QueryString from 'query-string';
import * as CC from 'cryptocompare-api'
import {Typeahead} from 'react-bootstrap-typeahead';

interface Props { }
interface State { data: Stock[]; available: any[], selected: any }

interface Stock {
	name:string;
	price:number;
	change:number;
	data:any;
}

class App extends React.Component<Props, State>
{
	static CURRENCY = "GBP";
	static DEFAULT = [ "BTC", "LTC", "ETH", "XRP", "IOT", "XRB","ENG", "REQ", "DOGE", "WABI" ];
	static WATCH = [ "BTC", "LTC", "ETH", "XRP", "IOT", "XRB","ENG", "REQ", "DOGE", "WABI" ];

	constructor(props:Props)
	{
		super(props);

		this.state = {
			data: [],
			available: [],
			selected: null
		};
	}

	arraysEqual(a1:any[],a2:any[]):boolean {
		/* WARNING: arrays must not contain {objects} or behavior may be undefined */
		return JSON.stringify(a1)==JSON.stringify(a2);
	}

	async getData()
	{
		var coins:any = QueryString.parse(location.search);

		var watch:string[] = coins.watch == null ? App.WATCH : coins.watch.split(',');

		const prices = await CC.getPriceMultiFull({ fsyms: watch, tsyms: [App.CURRENCY] });
	

		if(this.arraysEqual(watch, App.DEFAULT) == false)
		{
			history.pushState(null, "Doh", "?" + QueryString.stringify({ watch: watch.join(",")}, { encode: false } ));
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
		var coin = coin[0];

		App.WATCH.push(coin.Symbol);

		this.setState({
			selected: null
		})

		this.componentDidMount();
	}

	removeCoin(e:any, coin:any)
	{
		var coin = coin;

		App.WATCH.splice(App.WATCH.indexOf(coin.name), 1);

		this.componentDidMount();
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
						<Typeahead selected={this.state.selected} onChange={(selected) => { this.setState({selected}); }} options={this.state.available} placeholder={"...."} labelKey="FullName" />
						<Button outline color="success" onClick={(coin) => this.addCoin(this.state.selected)} >Add</Button>
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
									<th scope="row" onClick={(e) => this.removeCoin(e, data)} >{data.name}</th>
									<td>£{formatPrice(data.price)}</td>
									<td style={formatPercent(data.change)} >{data.change}%</td>
									<td style={{ width: '30%' }}>
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
				<div className="footer" >
					<a className="github-link" href="https://github.com/lucas-jones/Doh">GitHub</a>
				</div>
			</div>
		);
	}
}

export default App;