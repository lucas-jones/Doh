import * as React from 'react';
import { Container, Button } from 'reactstrap';
import Header from './header/Header';
import Search from './search/Search';
import Table from './table/Table';
import Footer from './footer/Footer';
import './App.css';

export default class App extends React.Component<{}, {}>
{
	static CURRENCY = "GBP";

	static WATCH = [ "BTC", "LTC", "ETH", "XRP", "IOT", "XRB","ENG", "REQ", "DOGE", "WABI" ];

	render()
	{	
		return (
			<div className="app">
				<Header />
				<Container className="stuff" >
					<Search />
					<Table />
				</Container>
				<Footer/>
			</div>
		);
	}
}