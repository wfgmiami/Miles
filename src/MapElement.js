import React, { Component } from 'react';
import InputComponent from './InputComponent';

class MapElement extends Component {

	constructor(){
		super();
		this.state = {
			bounds: new google.maps.LatLngBounds(),
			map: {},
			markers: []
		}
		this.addMarker = this.addMarker.bind(this);
		this.removeMarker = this.removeMarker.bind(this);
	}


	componentDidMount(){

		const mapDiv = document.getElementById("mapDiv");
		const mapOptions = {
			center: new google.maps.LatLng(40.70, -74.00),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 12
		}	

		this.setState( { map: new google.maps.Map(mapDiv, mapOptions) });
    }
	
	addMarker({ address, position }){
		this.state.bounds.extend(position);
		this.state.map.fitBounds(this.state.bounds);
		let marker = new google.maps.Marker( { position: position } );
		this.state.markers.push(marker);
		marker.setMap(this.state.map);		
	}
	
	removeMarker( index ){
		console.log('markers:',this.state.markers);
		console.log('in function',index);
		this.state.markers.forEach( (marker, _index) => {
			if(_index === index )
				marker.setMap(null);
		})
		this.state.markers.splice(index,1);
	}

	render(){
		return (
		  <div>
			<div id="mapDiv" className="col-xs-12" style={{ height: "350px", marginBottom: '20px' }}>
			</div>
			<InputComponent markers={ this.state.markers } addMarker={ this.addMarker } removeMarker={ this.removeMarker }/>	
		  </div>		
		)
	}

}

export default MapElement;
