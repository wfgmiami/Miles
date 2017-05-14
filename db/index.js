const pg = require('pg');
const connectionString = ("postgres://mapdata:mapdata1@geodata.cj5r5b9wgtmp.us-west-2.rds.amazonaws.com/geodatadb")
const client = new pg.Client(connectionString);
const getDistance = require('request');

let _client;
const connect = (cb) => {
	//console.log('client.....', client);
	if(_client)
		return cb(null, _client);
	client.connect(err => {
		if(!err){
			_client = client;
			return cb(null, _client);
		}
	})
}

const decodePoints = (body, cb) => {
	let result = JSON.parse(body);
	let startState = result.routes[0].legs[0].start_address.split(", ")[1].trim();
	let numSteps = result.routes[0].legs[0].steps.length;	
	let legs = result.routes[0].legs[0];
	let coordinates = [];

	for(let step = 0; step < numSteps; step++){
		let str = legs.steps[step].polyline.points	
		let index = 0,
			lat = 0,
			lng = 0,
	//		coordinates = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, 5)

		while (index < str.length){
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while ( byte >= 0x20 );

			latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
			shift = result = 0;
			
			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);	

			longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += latitude_change;
			lng += longitude_change;
			coordinates.push([lat / factor, lng / factor]);
		}
	}
	
	checkState(startState, coordinates, (err, states) => {
			if(err)
				console.log('error in checkState', err);
			console.log('..............states', states);
		  	cb(err, states);		
	})

}

const checkState = (startState, coordinates, cb) => {
//			console.log('coordintate....', coordinates);
//			console.log('startState......', startState);
//			throw new Error('error');
		
	connect( (err, client) => {
	
		if(err)
			return cb(err);

		let dataPoints = {
			startState: startState,
			stateMiles: [],		
			startLat: coordinates[0][0],
			startLng: coordinates[0][1]
		}
			let stateMiles = [];		
			let startLat = coordinates[0][0];
			let startLng = coordinates[0][1];
	
		for(let i = 0; i < coordinates.length; i++){
			let lat = coordinates[i][0];
			let lng = coordinates[i][1];
			let queryString = `SELECT stusps FROM tl_2009_us_state WHERE ST_CONTAINS(wkb_geometry, ST_GeomFromText('point( ${ lng } ${ lat })',4269))`;	
			console.log('...........i first', i);
		
			client.query(queryString, (err,result) => {
				console.log('..........i',i);
				if(err)
					return cb(err);
				if(result.rows.length){
					let state = result.rows[0]['stusps'].trim();
					if(state != startState){
						console.log('states old, new', startState, state);
	
						let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + dataPoints.startLat + "," + dataPoints.startLng + "&destinations=" + dataPoints.lat + "," + dataPoints.lng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";
						getDistance(url, (error, response, body) => {
								if (!error && response.statusCode == 200){
									let result = JSON.parse(body)
								//	console.log('.............startState, startLat, startLng,lan,lng', startState, startLat, startLng, lat, lng);
									let miles = result.rows[0].elements[0].distance.text;
									stateMiles.push({ state: startState, miles })
									startLat = lat;
									startLng = lng;
									startState = state;
									console.log('...........stateMiles: ', stateMiles);
								}
							})	
					}
	
		  		}

		 //cb(null, dataPoints.stateMiles)
	   		})
		}		

  })
}

/*
const getStateMiles = (dataPoints, cb) => {
			client.query(dataPoints, (err, result) => {
				if(err)
					return cb(err);
				if(result.rows.length){
					let state = result.rows[0]['stusps'].trim();
				    console.log('in getStateMiles...............',dataPoints);
					//throw new Error('error');
					if(state != startState){
						dataPoints.state = state;
						//let dataPoints = { lat, lng, startState, state, startLat, startLng, stateMiles };
									let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + dataPoints.startLat + "," + dataPoints.startLng + "&destinations=" + dataPoints.lat + "," + dataPoints.lng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";
							getDistance(url, (error, response, body) => {
								if (!error && response.statusCode == 200){
									let result = JSON.parse(body)
								//	console.log('.............startState, startLat, startLng,lan,lng', startState, startLat, startLng, lat, lng);
									let miles = result.rows[0].elements[0].distance.text;
								}
							})	
						//distanceCalculation(dataPoints, (err, result) => {
							//if(!err){
								//cb(err,result);
								//console.log('.....result', result.stateMiles);
								//dataPoints = result;
								//startState = result.startState;
								//startLat = result.startLat;
								//startLng = result.startLng;
								//stateMiles = result.stateMiles;	
								//throw new Error('error');
							//}
						//})						
				    }			
			    }			
			})
}

const distanceCalculation = (dataPoints, cb) => {
								//let startLat = dataPoints.startLat;
								console.log('data points.in distanceCalculation.....', dataPoints);
								throw new Error('error');
								let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + dataPoints.startLat + "," + dataPoints.startLng + "&destinations=" + dataPoints.lat + "," + dataPoints.lng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";
							getDistance(url, (error, response, body) => {
								if (!error && response.statusCode == 200){
									let result = JSON.parse(body)
								//	console.log('.............startState, startLat, startLng,lan,lng', startState, startLat, startLng, lat, lng);
									let miles = result.rows[0].elements[0].distance.text;
//	console.log('......calling diff states:', miles);
								    dataPoints.stateMiles.push({ state: dataPoints.startState, miles })
									dataPoints.startLat = dataPoints.lat;
									dataPoints.startLng = dataPoints.lng;
									dataPoints.startState = dataPoints.state;

									//console.log('stateMiles.......', dataPoints.stateMiles);
									cb(error, dataPoints);
								//	console.log('.............startState, startLat, startLng', startState, startLat, startLng);
								//throw new Error('error');
								}else{
									console.log('error in getDistance');
									 cb(error);
								}
							})	

}	
*/

module.exports = decodePoints;


