const mongoose = require('mongoose');
const axios = require('axios');

const APP_ID = 'MarceloP-rankMyAp-PRD-aa6d0a603-c010a1a8';
const EBAY_URI = `https://svcs.ebay.com/services/search/FindingService/v1?operation-name=findItemsByKeywords&service-version=1.12.0&security-appname=${APP_ID}&global-id=EBAY-US&response-data-format=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=3`;

const Alert = require('../models/alert.model');

const getAlerts = (req, res) => {
  Alert.find().exec((err, alerts) => {
    if(err) return res.json({'success':false,'message':'Some Error'});
    return res.json({'success':true,'message':'Alerts fetched successfully', alerts});
  });
}

const addAlert = (req, res) => {
  const newAlert = new Alert(req.body);
  newAlert.save((err, alert) => {
    if(err) return res.json({'success':false,'message':'Some Error'});
    return res.json({'success':true,'message':'Alert added successfully', alert});
  })
}

const updateAlert = (req, res) => {
  Alert.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true }, (err, alert) => {
    if(err) return res.json({'success':false,'message':'Some Error','error':err});
    return res.json({'success':true,'message':'Updated successfully', alert});
  })
}

const getAlert = (req, res) => {
  Alert.find({_id:req.params.id}).exec((err, alert) => {
    if(err) return res.json({'success':false,'message':'Some Error'});
    if(alert.length) return res.json({'success':true,'message':'Alert fetched by id successfully', alert});
    else return res.json({'success':false,'message':'Alert with the given id not found'});
  })
}

const deleteAlert = (req, res) => {
  Alert.findByIdAndRemove(req.params.id, (err, alert) => {
    if(err) return res.json({'success':false,'message':'Some Error'});
    return res.json({'success':true,'message':req.params.id+' deleted successfully'});
  })
}

const sendEmail = async (req, res, mailer) => {
  const { email, search } = req.body

  const ebayUri = EBAY_URI + `&keywords=${search}`;
  const ebayPromise = await axios.get(ebayUri);

  let items = ebayPromise.data.findItemsByKeywordsResponse[0].searchResult[0].item;
  items = items.map(item => {
    const { currentPrice } = item.sellingStatus[0];
    const price = currentPrice[0]['@currencyId'] + ' ' + currentPrice[0]['__value__'];

    return {
      title: item.title[0],
      price
    }
  });

  let mailText = `Resultados da busca ${search}:\n\n`;
  for(let i of items) {
    mailText += `${i.title}:\n${i.price}\n\n`;
  }

  let mailPromise;
  try {
    mailPromise = await mailer.sendTextMail(email, `Seu alerta '${search}'`, mailText);
  } catch(e) {
    console.log('error', e);
  }

  res.send('Email sent successfully.')
}

const controller = {
  getAlerts,
  addAlert,
  updateAlert,
  getAlert,
  deleteAlert,
  sendEmail
};

module.exports = controller;