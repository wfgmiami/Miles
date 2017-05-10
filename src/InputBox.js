import React,{ Component } from 'react';


class InputBox extends Component{
    
	constructor(){
		super();		
		this.autoCompleteInput = this.autoCompleteInput.bind(this);
	}	
	
	autoCompleteInput(){
		let autocomplete =[];
		let inputs = document.querySelectorAll('input');
		let inputCount = document.querySelectorAll('input').length;
		
		const autocompleteOptions = {
			types: ['(cities)'],
 		    componentRestrictions: { country: "us" }
		}

		for(let i = 0; i < inputCount; i++){
			let googleAutoComplete = new google.maps.places.Autocomplete(inputs[i], autocompleteOptions);
			autocomplete.push(googleAutoComplete);
			
			googleAutoComplete.addListener('place_changed', () => {
				if(this.props.markers.length !== this.props.numDestination && this.props.markers.length !== 0){
                  this.props.removeMarker(this.props.numDestination);
				}	
								
//				console.log('outside', this.props.markers.length, this.props.numDestination)

	  			const place = googleAutoComplete.getPlace();
				const address = place.formatted_address;
				const position = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
				this.props.addMarker({ address, position });
			})
		}

	}

	componentDidMount(){
		this.autoCompleteInput();
	}

	componentWillUnmount(){
		console.log(this.props.numDestination);	
		this.props.removeMarker(this.props.numDestination );
	}

	render(){
		
		return (
			<div>	
				Destination { ' ' } { this.props.numDestination }:
				<input className="form-control" id={ this.props.numDestination } >
				</input>
				<br />
			</div>
		)
	}
}

export default InputBox;
