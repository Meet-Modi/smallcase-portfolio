const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose').set('debug', true);
const path = require('path');
const config = require('./config/config.js');


const env = process.env.NODE_ENV || 'DEVELOPMENT';


// Router Files
const router = require('./routes');
const tradeRouter = require('./routes/trades');
const securityRouter = require('./routes/security');

mongoose
	.connect(env === 'DEVELOPMENT' ? config.MONGO_DB_URI_DEV : config.MONGO_DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		socketTimeoutMS: 3000,
		keepAlive: true,
	})
	.then(
		function () {
			//connected successfully
			console.log('MongoDB connection successful!');
		},
		function (err) {
			console.log(err);
		}
	);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
	res.send(`Hello World! request recieved on http://localhost:${port}`);
});

app.use('/api', router);
app.use('/api/trades', tradeRouter);
app.use('/api/securities', securityRouter);

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log(`Server is running on http://localhost:${port}`);

});