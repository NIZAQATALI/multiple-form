
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const docusign = require("docusign-esign");
const fs = require("fs");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const express = require('express');
const app = express();
const { JSDOM } = require('jsdom');
var db = require('../modals/index.js');
var  User =  db.userModel;
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(
  session({
    secret: "dfsf94835asda",
    resave: true,
    saveUninitialized: true,
  })
);
// let INTEGRATION_KEY = "f5f00311-0236-4dba-9c94-a9ce13cf6b56";
let BASE_PATH = "https://demo.docusign.net/restapi";
// let USER_ID = "fce6df83-b77c-4b10-952c-64abf5740f41";
let ACCOUNT_ID = "0c75e2fe-2d38-40ff-bac8-dc6dbc504a29";
//let ACCOUNT_ID = "c6f3cbeb-7167-45e5-bb90-ff8f9b9ee73b";
// let TEMPLATE_ID = "906bd4c9-7194-4afd-b0b9-0915c6c24964";
// let CLIENT_USER_ID = 1000;
var my_envelope;
var userId;
let request={
    session:{ access_token:'', expires_at:''},
}
async function Digisignature(req,res) {
  try{
    console.log(req.body.email,"req.body.email....................")
    console.log(req.body.name,"req.body.name")
    await checkToken(request);
    let envelopesApi =await getEnvelopesApi(request);
    console.log(envelopesApi,'envelopesApiiiiii');
    let envelope =await makeeEnvelope(
        req.body.name,
        req.body.email
    );
  console.log(envelope,'envelope');
  let results = await envelopesApi.createEnvelope(ACCOUNT_ID, {
    envelopeDefinition: envelope,
  });
  userId=req.user.id;
  console.log(results.envelopeId,'envelopeId');
 
  my_envelope=results.envelopeId;
 // Create the recipient view, the Signing Ceremony

  let viewRequest = await makeRecipientViewRequest(
    req.body.name,
    req.body.email
    );
  console.log(viewRequest, "viewRequest");

  let result = await envelopesApi.createRecipientView(
    ACCOUNT_ID,
    results.envelopeId,
    {
      recipientViewRequest: {
        returnUrl: viewRequest.returnUrl,
        email: viewRequest.email,
        userName: viewRequest.userName,
        authenticationMethod: 'none',
        clientUserId: 1000,
      },
    }
    );
    console.log(result);
    res.status(200).json({result});
    
  }catch(error){
    console.log(error);
  }
  }
function getEnvelopesApi(request) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(BASE_PATH);
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + request.session.access_token
  );
  return new docusign.EnvelopesApi(dsApiClient);
}

// function makeEnvelope(name, email, company) {
//   let env = new docusign.EnvelopeDefinition();
//   env.templateId = TEMPLATE_ID;
//   let text = docusign.Text.constructFromObject({
//     tabLabel: "company_name",
//     value: company,
//   });

//   // Pull together the existing and new tabs in a Tabs object:
//   let tabs = docusign.Tabs.constructFromObject({
//     textTabs: [text],
//   });

//   let signer1 = docusign.TemplateRole.constructFromObject({
//     email: email,
//     name: name,
//     tabs: tabs,
//     clientUserId: CLIENT_USER_ID,
//     roleName: "Applicant",
//   });

//   env.templateRoles = [signer1];
//   env.status = "sent";

//   return env;
// }

async function  makeeEnvelope(name,email) {
  try {
    const docBytes = fs.readFileSync('images\\1701266822765.pdf');
      const doc1b64 = Buffer.from(docBytes).toString('base64');

      // create the document
      const document = docusign.Document.constructFromObject({
          documentBase64: doc1b64,
          documentId: '1',
          fileExtension: 'pdf',
          name: 'test'
      });

      const cc1 = new docusign.CarbonCopy();
      cc1.email = 'hafiznizaqatali@gmail.com';
      cc1.name = name;
      cc1.routingOrder = '2';
      cc1.recipientId = '2';

      const signer =await docusign.Signer.constructFromObject({
          email: email,
          name: name,
          recipientId: 1,
          clientUserId:1000,
          roleName: 'Applicant'
      });
      // let signer1 = docusign.TemplateRole.constructFromObject({
      //   email: 'gamebird604@gmail.com',
      //   name: 'Hamza afzal',
      //   // tabs: tabs,
      //   clientUserId:1000,
      //   roleName: 'Applicant'
      // });

      const signature =await docusign.SignHere.constructFromObject({
          documentId: '1',
          name: 'signature',
          pageNumber: '1',
          recipientId: '1',
          tabLabel: 'signHere',
          tooltip: 'click here to add signature',
          xPosition: '500',
          yPosition: '737'
      });

      signer.tabs =await docusign.Tabs.constructFromObject({
          signHereTabs: [signature]
      });

      const customFields =await docusign.CustomFields.constructFromObject({
          SignHere: signature,
          textCustomFields: [
              {
                  name: 'EnvelopeInfo',
                  value: 'my data'
              }
          ]
      });

      const recipients =await docusign.Recipients.constructFromObject({
          carbonCopies: [cc1],
          signers: [signer]
      });

      // create the envelope definition.
      const envelopeDefinition =await docusign.EnvelopeDefinition.constructFromObject({
          customFields: customFields,
          documents: [document],
          emailSubject: 'Please sign this salary document',
          recipients: recipients,
          status: 'sent'
      });
      console.log(envelopeDefinition,'envlop definationnnnnnnn');
      return envelopeDefinition;
  } catch (error) {
      console.log(error, "line")
  }
}


async function makeRecipientViewRequest(name, email) {
  let viewRequest = new docusign.RecipientViewRequest();
console.log(my_envelope,"my_envelope");

  viewRequest.returnUrl = "http://localhost:3000/strip";
  if(viewRequest.returnUrl)
  {
    console.log(userId,"userId..........................")
  const  user =await User.findByPk(userId);
    console.log(user,"user.id..........................")
    user.envelop_id=my_envelope;
    await user.save();
  }
  viewRequest.authenticationMethod = "none";

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = email;
  viewRequest.userName = name; // Use 'userName' instead of 'name'
  viewRequest.clientUserId = "fce6df83-b77c-4b10-952c-64abf5740f41";
  // Optional: Set clientUserId if needed
  // viewRequest.clientUserId = CLIENT_USER_ID;
  return viewRequest;
}
async function checkToken(request) {
  if (request.session.access_token && Date.now() < request.session.expires_at) {
    console.log("re-using access_token ", request.session.access_token);
  } else {
    // console.log("generating a new access token");
    // let dsApiClient = new docusign.ApiClient();
    // dsApiClient.setBasePath(process.env.BASE_PATH);
    // const results = await dsApiClient.requestJWTUserToken(
    //     process.env.INTEGRATION_KEY,
    //     process.env.USER_ID,
    //     "signature",
    //     fs.readFileSync(path.join(__dirname, "private.key")),
    //     3600
    // );
    const url = "https://account-d.docusign.com/oauth/token";
    const data = {
      grant_type: "refresh_token",
      refresh_token:
        "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAgABwCASQsAkxLcSAgAgMlv-CUq3EgCAEZjzRHBJDdHknpmJzdkFl0VAAEAAAAYAAEAAAAFAAAADQAkAAAAMmRlNDVmZDUtMjFhYS00YzNkLWI3MzQtZmY1OTNkNTgxYTgxIgAkAAAAMmRlNDVmZDUtMjFhYS00YzNkLWI3MzQtZmY1OTNkNTgxYTgxMAAAhLBDkBLcSDcAMsmKKYbTDUGJ457P96Itkw.fr_UmxjLY-5K35EEU2dx4ix-_ACkZD9Jg-AMz5AqZRjb8ImxAcPodj-PhH340yCvDKBJwXysXr8mAltb3ksSFK9zQvuDHjb3rOGB3CZvzVGVKdggooI7fS1gHWgBwV9nFa5BJ-MNVqsuw47wIJN33dZdE-o3hqn6WvRlXzTp8YOQvfs8l7ljY1nS6MxYItMD5B3FcJaKMWIgBrBMRtw-1MV21g_HCIXZSfE1yl5HaZQo7j1KFl595xBDAv9wXbtIMKRmQL8DNndVzlo5Ub49Urbqse5KFM_PLStI6Tip6_34WTgemSDhm7ynCJZO0ijIbAVINAvXNQiRkwfrLGykCg",
    };

    const headers = {
      Authorization:
      "Basic MmRlNDVmZDUtMjFhYS00YzNkLWI3MzQtZmY1OTNkNTgxYTgxOjI4ZDMyOWI2LTdkZDMtNGZmNS1iNDg4LTNjMDU1M2M4ZWE1Zg==",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const results = await axios.post(url, new URLSearchParams(data), {
      headers,
    });
    //  console.log('Token Response:', results.data);
    //  request.session.access_token=response.data.access_token;
    //  results.body.expires_in=response.data.expires_in;
    //  return response.data;

    //  throw error; // Re-throw the error to be caught by the calling function

    // console.log(results.body);
    request.session.access_token = results.data.access_token;
    request.session.expires_at =
      Date.now() + (results.data.expires_in - 60) * 1000;
  }
}

// async function checkToken(request) {
//   if (request.session.access_token && Date.now() < request.session.expires_at) {
//     console.log("re-using access_token ", request.session.access_token);
//   } else {
//     const url = "https://account-d.docusign.com/oauth/token";

//     const data = {
//       grant_type: "refresh_token",
//       refresh_token:
//         "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAgABwCAmkwhQvbbSAgAgBqxGdUN3EgCAIPf5vx8txBLlSxkq_V0D0EVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAAGY1ZjAwMzExLTAyMzYtNGRiYS05Yzk0LWE5Y2UxM2NmNmI1NiIAJAAAAGY1ZjAwMzExLTAyMzYtNGRiYS05Yzk0LWE5Y2UxM2NmNmI1NjAAAID7Ejz220g3AC1YUzmtcd9LtcjvLYoCXoM.ecyl9Q1_QiJcsLlnaiDM0hXEUumVILxerJWeu2rlAQSqr-Hqq42ygexmTrKn_ullsjHvlAmkpM0swgzDBq4915l_z_YYmzVv7bE4M4KtomF6DID8lEtUOfegBvktS0TzKdwLqUqDiACpTbO7JDGQNdOpLZ8vOAUmeQlKR3-JNHpsaFaLTGIO0uJvGh7EKZDoXkiH6pr4dk5FaJbpQbQ0w2zRTz68N4B1Wm22ddfCgHDysCMbo_yFHzvJ5-6ifqPivAaIKBIGCVO048z0foC16g0A3DNjBuG-et5ewdnvG7USRlUCwHrrRNCUzhRm-dn6iFQ7oW8PpFFFcocsCDk9Tw",
//     };

//     const headers = {
//       Authorization:
//         "Basic ZjVmMDAzMTEtMDIzNi00ZGJhLTljOTQtYTljZTEzY2Y2YjU2OmRkYjZkMmRhLTJjYzAtNGM0Yi04MjdmLTcxNzVjYWJhYTM0MQ==",
//       "Content-Type": "application/x-www-form-urlencoded",
//     };

//     const results = await axios.post(url, new URLSearchParams(data), {
//       headers,
//     });
//     request.session.access_token = results.data.access_token;
//     request.session.expires_at =
//       Date.now() + (results.data.expires_in - 60) * 1000;
//   }
// }
module.exports={
    Digisignature
}