const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const docusign = require("docusign-esign");
const fs = require("fs");
const session = require("express-session");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const express = require('express');
const app = express();
const { JSDOM } = require('jsdom');
var db = require('../modals/index.js');
async function webhook(req, res) {
    // console.log(req);
    const sessionId=req.body.id;
  //   if(req.body.action==='submitted'){
  //  const sessionPersonResponse= await  sessionPerson(sessionId);``
  //   }
  //   else if(){}

  
   console.log("verif controller")
   // const sigHeader = req.headers['stripe-signature'];
   const eventString = req.body.toString('utf-8');
   const eventString1 = JSON.stringify(req.body, null, 2);
   console.log("webhook")
 console.log("eventstring...",eventString1,"")

 
 }
 async function createsession(req, res) {
    // console.log(req);
  //  console.log(req.body);
   console.log("verif controller craetion session")
  //  var data = JSON.stringify({
  //   "verification": {
  //     "callback": "https://veriff.me",
  //     "vendorData": "46d3ab65-9026-4ec2-8d37-d3bddb999567"
  //   }
  // });
  
  // var config = {
  //   method: 'post',
  // maxBodyLength: Infinity,
  //   url: '/v1/sessions/',
  //   headers: { 
  //     'Content-Type': 'application/json', 
  //     'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14'
  //   },
  //   data : data
  // };
  
  // axios(config)
  // .then(function (response) {
  //   console.log(JSON.stringify(response.data));
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  try {
    const apiUrl = `https://stationapi.veriff.com/v1/sessions/`;
    const response = await axios.post(apiUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14'
      },
    });
 
    console.log(response.data.verification.url);//session url
    console.log(response.data.verification.id);//session id sttore this
   
 
 }catch(err){
  console.log(err)
 }}
 async function sessionPerson(req, res) {
  const sharedSecretKey='9a7c250f-29bd-49bf-a3f0-ef157f07ce7a';
  const hmac = crypto.createHmac('sha256', sharedSecretKey);
  //SESSIONiD
const dataToSign=req.body.sessionId; 
  // Update the HMAC hash with the data to sign
  hmac.update(dataToSign);
  const signature = hmac.digest('hex');
  console.log(signature,'signnnnnnnnnnnnnnnnnnn');


  try {
    const apiUrl = `https://stationapi.veriff.com/v1/sessions/${req.body.sessionId}/person`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14',
        'X-HMAC-SIGNATURE':`${signature}`

      },
    });
 
    console.log(response.status);//session url
//  return res.status(200).JSON({...response});
 }catch(err){
  console.log(err)
 }
   
   
   
 
 }
 
 async function deletesession(req, res) {  
  try {
    const sharedSecretKey='9a7c250f-29bd-49bf-a3f0-ef157f07ce7a';
    const hmac = crypto.createHmac('sha256', sharedSecretKey);
    //SESSIONiD
  const dataToSign=req.body.sessionId; 
    // Update the HMAC hash with the data to sign
    hmac.update(dataToSign);
    const signature = hmac.digest('hex');
    console.log(signature,'signnnnnnnnnnnnnnnnnnn');
  const apiUrl = `https://stationapi.veriff.com/v1/sessions/${req.body.sessionId}`;
  const response = await axios.delete(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14',
      'X-HMAC-SIGNATURE':`${signature}`

    },
  });

  console.log(response);//session url
 

}catch(err){
console.log(err)
}
   

 
 }
  module.exports =  { 
    webhook,
    createsession,
    deletesession,sessionPerson
}