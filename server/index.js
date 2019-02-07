const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pino = require('express-pino-logger')();
const logger = require('morgan');
const mongoose = require('mongoose');
const bb = require('express-busboy');
const axios = require('axios');

const Routes = require('../api/routes');
const EmailSender = require('../api/EmailSender');

const app = express();
bb.extend(app);

// allow-cors
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(pino);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://marcelo:marcelo123@ds225375.mlab.com:25375/rank-my-app-demo');

const mailer = new EmailSender();
mailer.init();

const router = new Routes(mailer);
router.init();

app.use('/api', router.router);

app.get('/api/ebay', (req, res) => {
	const { search } = req.query;
  res.setHeader('Content-Type', 'application/json');
  axios.get(`https://svcs.ebay.com/services/search/FindingService/v1?operation-name=findItemsByKeywords&service-version=1.12.0&security-appname=MarceloP-rankMyAp-PRD-aa6d0a603-c010a1a8&global-id=EBAY-US&response-data-format=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=3&keywords=${search}`)
  	.then(response => {
  		console.log(response.data)
  		res.send(JSON.stringify(response.data));
  	});
});


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);