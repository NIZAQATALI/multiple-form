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
var  User =  db.userModel;
var ourUser;
// async function webhook(req, res) {
//     // console.log(req);
//     const sessionId=req.body.id;
// const userId= req.user.id;
// const  user= await User.findByPk(userId);
// var verifyUsername;
// var dbUsername;
//     if(req.body.action==='submitted'){
//     const sessionPersonResponse= await  sessionPerson(sessionId);
//     if(sessionPersonResponse.status=="success"){
//  verifyUsername=sessionPersonResponse.person.firstName+sessionPersonResponse.person.lastName
//  if(user){
//   dbUsername=user.first_name+user.last_name
//  }else{
//    return  res.status.json({})
//  }
//     }
//     }
//     else if(req.body.action==='started'){
//    user.session_status="started"
//  await user.save()
//     } else if(req.body.action==='created'){
//       user.session_status="created"
//      await user.save();
//     }

//  }
async function webhook(req, res) {
  console.log("veriffff")
  const userId = ourUser; 
  console.log(userId)
  console.log(req.body.id,"session id is  here")
  var dbUsername; 

  var verifyUsername;
  const user = await User.findOne({
    where: {
      session_id: req.body.id
    }
  });
  if (user) {
    // User found
    console.log(user);
    if (req.body.action === 'submitted') {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

       // Introduce a delay of 5 seconds
  await delay(5000);
      const sessionPersonResponse = await sessionPerson(req.body.id);
      console.log(user.id,".............db user idddddddddddddddddd")
      console.log(user.session_id,".............db session id")
      console.log(sessionPersonResponse,".............sessionPersonResponse")
      if (sessionPersonResponse.status === "success") {
       
          verifyUsername = sessionPersonResponse.person.firstName + sessionPersonResponse.person.lastName;
          console.log(verifyUsername,"................verifyUsername");
          if (user) {
              dbUsername = user.first_name + user.last_name;
              // Check if dbUsername and verifyUsername match
              if (dbUsername !== verifyUsername) {
                  // Update user's first_name and last_name
                  user.first_name = sessionPersonResponse.person.firstName;
                  user.last_name = sessionPersonResponse.person.lastName;
                  console.log(user.first_name,"userrrrrrrrr");
                  // Save the updated user object
                  await user.save();
              }
          } else {
              return res.status(404).json({ error: 'User not found' });
          }
      }
  } else if (req.body.action === 'started') {
      user.session_status = "started";
      await user.save();
  } else if (req.body.action === 'created') {
      user.session_status = "created";
      await user.save();
  }


  } else {
    // User not found
    console.log('User not found');
  }


 
  

  // Add additional logic or response handling as needed
  return res.status(200).json({ message: 'Webhook processed successfully' });
}
 async function createsession(req, res) {
  const  id  =req.user.id;
  ourUser=id;
  console.log(id,"iddddddddddddddddddddddddddd")
//   try {
//     const apiUrl = `https://stationapi.veriff.com/v1/sessions/`;
//     const response = await axios.post(apiUrl,{
      // headers: {
      //   'Content-Type': 'application/json',
      //   'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14'
      // },
//     });
//     console.log(response.data.verification.url);//session url
//     console.log(response.data.verification.id);//session id sttore this
//     return

//  }catch(err){
//   console.log(err)
//  }
console.log('api startttttttttttttttttttttt')
try {
  const apiUrl = 'https://stationapi.veriff.com/v1/sessions/';
  // Make an API call using fetch or Axios
  const response = await fetch(apiUrl, {
    method: 'POST', // or 'GET' depending on your API
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14'
    },
  });
  // Check if the API request was successful (HTTP status code 200)
  if (response.ok) {
    // Parse the JSON response
    const data = await response.json();
    console.log('API responseeeeeeee:', data.verification.id);
       const user=await User.findByPk(id);
    user.session_id=data.verification.id;
    await user.save();
    return res.status(200).json(data);
  } else {
    console.error('API request failed with status:', response.status);
    // Handle the unsuccessful API response as needed
  }
 
} catch (error) {
  console.error('Error calling API:', error.message);
  // Handle the error appropriately, e.g., show an error message
}

}


 async function sessionPerson(sid,res) {
  const sharedSecretKey='9a7c250f-29bd-49bf-a3f0-ef157f07ce7a';
  const hmac = crypto.createHmac('sha256', sharedSecretKey);
  //SESSIONiD
const dataToSign=sid; 
  // Update the HMAC hash with the data to sign
  hmac.update(dataToSign);
  const signature = hmac.digest('hex');
  console.log(signature,'signnn');
  try {
    const apiUrl = `https://stationapi.veriff.com/v1/sessions/${sid}/person`;
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': 'bddc2061-f8b7-4a3b-a33d-1417dc439a14',
        'X-HMAC-SIGNATURE':`${signature}`

      },
    });
    console.log(response.data);//session url
    return  res.status(200).json(response.data);
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
    deletesession,
    sessionPerson
}