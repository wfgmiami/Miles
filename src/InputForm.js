import React, { Component } from 'react';

class InputForm extends Component{

	render(){
		return (	
			
		  <div className="form-group">	
			<div className="col-xs-6">
				Starting Location: { ' ' }
				<input className="form-control">
				</input><br />		
				
				{ this.props.children }
				
				<button className="btn btn-default" onClick={ this.props.addDestination }>Add Destination</button>{ ' ' }
				{ this.props.numDestination > 1 ? <button className="btn btn-default" onClick={ this.props.removeDestination }> Remove Destination</button> : null }
			</div> 	
		   <div className="col-xs-6">
			<button className="btn btn-default" onClick={ this.props.generateRoute }>Mileage by State</button>
		   </div>
		 </div> 
			
		)
	}	
}	

export default InputForm;

