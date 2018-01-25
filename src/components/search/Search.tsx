import * as React from 'react';
import * as CC from 'cryptocompare-api'
import { Typeahead } from 'react-bootstrap-typeahead';
import { Button } from 'reactstrap';

interface State
{
	available:any;
}

export default class Search extends React.Component<{}, State>
{
	constructor(props:{})
	{
		super(props);

		this.state = {
			available: []
		};
	}

	async componentDidMount()
	{
		const avil = await CC.getCoinList();

		this.setState({
			available: Object.keys(avil.Data).map((symbol) => avil.Data[symbol])
		});
	}

	render()
	{	
		return (
			<div className="search" >
				<Typeahead options={this.state.available} placeholder={"...."} labelKey="FullName" />
				<Button outline color="success" >Add</Button>
			</div>
		);
	}
}