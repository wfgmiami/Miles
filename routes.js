const router = require('express').Router();
const decodePoints = require('./db');
const getRoute = require('request');

router.get('/',(req,res,next)=>{
	//console.log('hit api route',req.query[0]);

	getRoute(req.query[0], (error, response, body) => {
		if(!error && response.statusCode == 200){

			decodePoints(body, (err, result) => {
				if(err){
					console.log('error return from decodePoints ');
					response.statusCode(403);
				}else{
					console.log('in routes.........', result);
				}
			});
		}else{
			console.log('error in getRoute routes.js');
			res.statusCode(403);
		}
 	})
})


module.exports = router;
