import React, { Component } from 'react';

class TaxTable extends Component{
	constructor(props){
		super();
		this.state = {

			mpg:[6],
			taxPaidGallons:[],
			taxableGallons:[],
			netTaxableGallons:[],
			taxRate:[]
			//milesTable: this.props.milesTable
			
		}

		this.onMpgAdd = this.onMpgAdd.bind(this);
		this.onTaxPaidGallonsAdd = this.onTaxPaidGallonsAdd.bind(this);
//		this.onTaxableGallonsAdd = this.onTaxableGallonsAdd.bind(this);
}


	onMpgAdd(ev){
		
		for(let i = 0; i < this.props.milesTable.length; i++){
			this.state.taxableGallons[i] = this.props.milesTable[i].miles / ev.target.value;
		}	
//		console.log('onMpgAdd', document.getElementById('taxableGallons').textContent);	
//		let taxableGallons = document.getElementById('taxableGallons').textContent;
//		this.setState({ taxableGallons: taxableGallons });
		this.setState({ mpg: ev.target.value });
		console.log('state after mpg update', this.state);
	}

//	onTaxableGallonsAdd(ev){
//		console.log('taxable gallons called');
//		this.setState({ taxableGallons: ev.target.value }); 	
//	}

	onTaxPaidGallonsAdd(ev){
//		console.log(ev.target.id,ev.target.value);
	//	let taxableGallons = document.getElementById('taxableGallons').textContent;
	//	this.setState({ taxableGallons: taxableGallons });
		//this.setState( { taxPaidGallons[ev.target.id]: ev.target.value });
		for(let i = 0; i < this.props.milesTable.length; i++){
			this.state.taxableGallons[i] = this.props.milesTable[i].miles / this.state.mpg;
		}	
	
		this.state.netTaxableGallons[ev.target.id] = Number(this.state.taxableGallons[ev.target.id]).toFixed(2) - Number(ev.target.value).toFixed(2);
		this.state.taxRate[ev.target.id] = 0.22;

		this.state.taxPaidGallons[ev.target.id] = ev.target.value;
		this.setState({ mpg: this.state.mpg });
		console.log('state after paidGallonsAdd', this.state);
	}

//	componentDidMount(){
//	}

	render(){

		return(	
			<div className="col-xs-7">
				<table>
					<thead>
						<tr>
							<th className="size">State</th>
							<th className="size">IFTA miles</th>
							<th className="size">MPG { ' ' } <input className="size" value={ this.state.mpg } onChange={ this.onMpgAdd }></input></th>
							<th className="size">Taxable gallons</th>
							<th className="size">Tax paid gallons</th>
							<th className="size">Net taxable gallons</th>
							<th className="size">Tax rate</th>
							<th className="size">Tax (credit) due</th>
							<th className="size">Interest due</th>
							<th className="size">Total due</th>
							
						</tr>
						
					</thead>

					<tbody>
						{ this.props.milesTable ? 
							this.props.milesTable.map( (stateMiles, index) => {

							return (			
								<tr key={ index } >
									<td className="item">
										{ stateMiles.state }
									</td>
									<td className="item">
										{ stateMiles.miles }
									</td>
									<td className="item">
										{ this.state.mpg } 	
									</td>

									<td id={ index } className="item">
										{ stateMiles && this.state.mpg.length ? Number(stateMiles.miles/this.state.mpg).toFixed(2) : null }
									</td>

									<td id="taxPaidGallons" className="item">
										<input placeholder="" className="form-control" value={ this.state.taxPaidGallons[index] } id={ index } onChange={ this.onTaxPaidGallonsAdd } ></input>
									</td>

									<td id="netTaxableGallons" className="item">
										{ this.state.taxableGallons && this.state.taxPaidGallons[index] ? (Number(this.state.taxableGallons[index]) - Number(this.state.taxPaidGallons[index])).toFixed(2) : null }								
									</td>

									<td id="taxRate" className="item">
										0.22
									</td>
	
									<td id="taxDueCredit" className="item">
										{ this.state.netTaxableGallons[index] ? (this.state.netTaxableGallons[index] * this.state.taxRate[index]).toFixed(2) : null }								
									</td>
	
									<td id="interestDue" className="item">
										0
									</td>
		
									<td id="totalDue" className="item">
										19
									</td>
								</tr>
							)
						})
						: null }

					</tbody>
				</table>	
			</div>

		)
	}
}

export default TaxTable;
