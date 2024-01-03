const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const docusign = require("docusign-esign");
const fs = require("fs");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const app = express(); 
const { JSDOM } = require('jsdom'); 
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
// const endpointSecret = 'we_1OMAsFKQiLOn1OUqeZtUV1mA';
const stripe = require('stripe')('sk_test_51ONV2iDFtRPRKo4NMXKF8kcY6zbFGNe8NWiNQMn4SfZHYpycBQXWftfU9XmArl4HcKNlNwz7BAWwDgFog8prxTKl00d4fgM9Qy');
var db = require('../modals/index.js');
var  User =  db.userModel;
// const YOUR_DOMAIN = 'http://localhost:5000';
//  async function sessionStripe (req, res)  {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price: 'price_1ONVA5DFtRPRKo4NBcQgT0S4',
//         quantity: 1,
//       },  {
//         price: 'price_1ONVM9DFtRPRKo4Niznk6Mna',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `https://www.google.com`,
//     cancel_url: `https://www.youtube.com`,
//   });
// //   res.redirect(303, session.url);
// console.log(session.url);
// return ({url:session.url});
// }
async function sessionStripe(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1ONVA5DFtRPRKo4NBcQgT0S4',
          quantity: 1,
        },
        {
          price: 'price_1ONVM9DFtRPRKo4Niznk6Mna',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/my-form`,
      cancel_url: `https://www.youtube.com`,
    });

    console.log(session.url);
    
    // Sending the URL in the response
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
 async function webhook(req, res) {
   console.log(req);
  console.log(req.body);
  // const sigHeader = req.headers['stripe-signature'];

  //const eventString = req.body.toString('utf-8');
  // const eventString = JSON.stringify(req.body, null, 2);
  // console.log("webhook")
// console.log("eventstring...",eventString,"")
 
  //const invoice = await stripe.invoices.retrieve(data.object.id);
//   try {
//     const eventString = req.body.toString('utf-8');
//     const event = JSON.parse(eventString);
// console.log(event)
//     // Handle specific event types
//     switch (event.type) {
//       case 'checkout.session.completed':
//         const checkoutSession = event.data.object;
//         // Access specific fields from the checkout session
//         const sessionId = checkoutSession.id;
//         const paymentStatus = checkoutSession.payment_status;
//         const amountTotal = checkoutSession.amount_total;
//         // Perform actions based on the received information
//         console.log('Checkout session completed:', sessionId);
//         console.log('Payment status:', paymentStatus);
//         console.log('Total amount:', amountTotal);
//         // Your logic to handle the completed checkout session
//         break;
//       // Handle other event types if needed
//       default:
//         console.log('Unhandled event type:', event.type);
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error('Error verifying Stripe webhook:', err.message);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }a
}
async function webhookhubspot(req, res) {

  const body =req.body[0];
    console.log(body);
  const id=body.objectId;
  console.log(body.propertyName,'name');
  console.log(body.propertyValue,'value');
  console.log(id,'object id');
 const user=await User.findOne({where:{
    hubspot_record_id:body.objectId
  }});
  console.log(user);
  // user.hubspotAmount=body.propertyValue;
  // console.log("user.hubspot  amount",user.hubspotAmount);
  // await user.save();
 // const sigHeader = req.headers['stripe-signature'];

 //const eventString = req.body.toString('utf-8');
 // const eventString = JSON.stringify(req.body, null, 2);
 // console.log("webhook")
// console.log("eventstring...",eventString,"")

 //const invoice = await stripe.invoices.retrieve(data.object.id);
//   try {
//     const eventString = req.body.toString('utf-8');
//     const event = JSON.parse(eventString);
// console.log(event)
//     // Handle specific event types
//     switch (event.type) {
//       case 'checkout.session.completed':
//         const checkoutSession = event.data.object;
//         // Access specific fields from the checkout session
//         const sessionId = checkoutSession.id;
//         const paymentStatus = checkoutSession.payment_status;
//         const amountTotal = checkoutSession.amount_total;
//         // Perform actions based on the received information
//         console.log('Checkout session completed:', sessionId);
//         console.log('Payment status:', paymentStatus);
//         console.log('Total amount:', amountTotal);
//         // Your logic to handle the completed checkout session
//         break;
//       // Handle other event types if needed
//       default:
//         console.log('Unhandled event type:', event.type);
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error('Error verifying Stripe webhook:', err.message);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }a
}
module.exports =  {
    webhook, 
    sessionStripe,
     webhookhubspot
}