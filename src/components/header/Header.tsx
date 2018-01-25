import * as React from 'react';

export default class Entry extends React.Component<{}, {}>
{
	render()
	{
		return (
			<div>
				<img className="logo" src='/doh.svg' />
				<h1 className="display-1">Doh</h1>
				<br />
			</div>
		);
	}
}