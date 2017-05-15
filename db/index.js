const pg = require('pg');
const connectionString = ("postgres://mapdata:mapdata1@geodata.cj5r5b9wgtmp.us-west-2.rds.amazonaws.com/geodatadb")
const client = new pg.Client(connectionString);
const getDistance = require('request');

let _client;
const connect = (cb) => {
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
 	let endState = result.routes[0].legs[0].end_address.split(", ")[1].trim();
 	let numSteps = result.routes[0].legs[0].steps.length;
 	let legs = result.routes[0].legs[0];
    let startPoint = result.routes[0].legs[0].start_location;
    let endPoint = result.routes[0].legs[0].end_location;
	let coordinates = [];
	let checkPoint = [];
	let stateMiles = [];

	connect( (err, client) => {
		if(err) cb(err);

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
			
			checkPoint[step] ={ lat: lat/factor, lng: lng/factor };
			
			findState(checkPoint[step], (err, state) => {
				if(!err){
			//		console.log(state,startState);				
					if( state !== startState){
						
					 stateMiles.push({ state: startState, startPoint: startPoint, endPoint: checkPoint[step] })
					
						if(state == endState){
							
							stateMiles.push({ state: endState, startPoint: checkPoint[step], endPoint: endPoint })
							//console.log('before cb...stateMiles.', stateMiles)
							cb(null, stateMiles)
						}

					   	startPoint = checkPoint[step];
						startState = state;
//						console.log(stateMiles);
	
					}
				}
			})

			//coordinates.push([lat / factor, lng / factor]);
 		}
 	}
// console.log(coordinates)
  })
}


const findState = (coordinates, cb) => {
		
		let queryString = `SELECT stusps FROM tl_2009_us_state WHERE ST_CONTAINS(wkb_geometry, ST_GeomFromText('point( ${ coordinates.lng } ${ coordinates.lat })',4269))`;

				client.query(queryString, (err,result) => {
					if(err)
						return cb(err);
					if(result.rows.length){
						let state = result.rows[0]['stusps'].trim();
						cb(null,state)
					}
				})
}

const getStateMiles = (data, cb) => {
	let milesByState = [];
	let state;
	let cnt = data.length;
	let track = 0;

	for(let i = 0; i < cnt; i++){

		let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + data[i].startPoint.lat + "," + data[i].startPoint.lng + "&destinations=" + data[i].endPoint.lat + "," + data[i].endPoint.lng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";
	
		getDistance(url, i, (error, response, body) => {
			state = data[i].state;

			if (!error && response.statusCode == 200){
				let result = JSON.parse(body)
				let miles = result.rows[0].elements[0].distance.text;
				milesByState.push({ state: state, miles: miles });
				track++;
				
				if( track === cnt ){
			   	//	console.log('i, cnt, milesByState', i,cnt,milesByState);
					cb(null, milesByState);
				}
			}
		})
	}	
}




const checkState = (startState, endState, coordinates, cb) => {

	connect( (err, client) => {

		if(err)
			return cb(err);
			let cnt = 0;
			let stateMiles = [];
			let startLat = coordinates[0][0];
			let startLng = coordinates[0][1];
			//coordinates.length= 2320 newark - stamford: 2320 steps 3 states
			//step 862 there is NJ bocomes NY
		for(let i = 0; i < 20; i++){
			let lat = coordinates[i][0];
			let lng = coordinates[i][1];
			let queryString = `SELECT stusps FROM tl_2009_us_state WHERE ST_CONTAINS(wkb_geometry, ST_GeomFromText('point( ${ lng } ${ lat })',4269))`;

			console.log('outside client.query i', i);

			client.query(queryString, (err,result) => {
				console.log('inside client.query i', i);
				if(err)
					return cb(err);
				if(result.rows.length){
					let state = result.rows[0]['stusps'].trim();
					cb(null,state)
					//console.log('state startState, i', state,startState, i);
					// if(state != startState){
					// 	//console.log('states old, new,endState,i', startState, state,endState,i);
					// 	tempState = startState;
					// 	startState = state;

					// 		let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + startLat + "," + startLng + "&destinations=" + lat + "," + lng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";

					// 	if (state == endState){
					// 			let endLat = coordinates[coordinates.length - 1][0];
					// 			let endLng = coordinates[coordinates.length - 1][1];
					// 			//console.log('....endLat, endLng', endLat, endLng)
					// 			url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + lat + "," + lng + "&destinations=" + endLat + "," + endLng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";
					// 	}
					// 	startLat = lat;
					// 	startLng = lng;

					// 	getStateMiles(url, (err, miles) => {

					// 		if(!err){
					// 			stateMiles.push({ state: tempState, miles });

					// 			if (state == endState){
					// 				let endLat = coordinates[coordinates.length - 1][0];
					// 				let endLng = coordinates[coordinates.length - 1][1];
					// 				//console.log('....endLat, endLng', endLat, endLng)
					// 				url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + lat + "," + lng + "&destinations=" + endLat + "," + endLng + "&mode=driving&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g";

					// 				getStateMiles(url, (err, miles) => {
					// 					if(!err)
					// 						stateMiles.push({ state: endState, miles });
					// 					cb(null,stateMiles)
					// 				})

					// 			}
					// 		}
					// 	})
					// }

		  	}

		 //cb(null, dataPoints.stateMiles)
	   	})
		}

  })
}





module.exports = {
	decodePoints,
	getStateMiles
}

