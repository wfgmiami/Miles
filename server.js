const express = require('express');
const app = express();
//const db = require('./db')
const router = require('./routes');

app.use('/vendor', express.static(__dirname + '/node_modules'));
app.use('/dist', express.static(__dirname + '/dist'));

app.get('/', (req,res,next) => {
 
	res.sendFile(__dirname + '/index.html');
})

app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`listening on port ${port}`));

//db.seed()
//.then(console.log('db synced and seeded'))
//.catch( e => console.log(e))
