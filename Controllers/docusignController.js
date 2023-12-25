
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
const endpointSecret = 'we_1OMAsFKQiLOn1OUqeZtUV1mA';
const stripe = require('stripe')('sk_test_51OM74KKQiLOn1OUqIdhVJX1BEOyXzN3kfQqMyKA25kK03j4obBm7cvIqQLOLzsKHlI2V8wSl4IfXRHg1DxO3ab2i00dKsunEpB');
// Handle preflight requests for the /initiate-docusign route
let docusignInstance = null;
let url;
// // app.post("/form", 
// async function form (request, response) {
//   request.body={
//     name: 'nizaqat ali',
//     email: 'gamebird604@gmail.com',
//     company: 'alpha'
// }
//   await checkToken(request);
//   let envelopesApi = getEnvelopesApi(request);
//   let envelope = makeEnvelope(
//     request.body.name,
//     request.body.email,
//     request.body.company
//   );
//   let results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
//     envelopeDefinition: envelope,
//   });

//   let viewRequest = await makeRecipientViewRequest(
//     request.body.name,
//     request.body.email
//   );
//   console.log(viewRequest, "viewRequest");
// console.log(results.envelopeId,'envlop Id');
//   results = await envelopesApi.createRecipientView(
//     process.env.ACCOUNT_ID,
//     results.envelopeId,
//     {
//       recipientViewRequest: {
//         returnUrl: viewRequest.returnUrl,
//         email: viewRequest.email,
//         userName: viewRequest.userName,
//         authenticationMethod: viewRequest.authenticationMethod,
//         clientUserId: 1000,
//         	   frameAncestors:[
//               "http://localhost:8000",
//               "https://apps-d.docusign.com"
//         	   ],
//         	   messageOrigins:[
//               "https://apps-d.docusign.com"
//         	   ]
//       },
//     }
//   );
//   console.log(results.url);
//   url=results.url;
//   return {url}  // await focusedView(results.url);
//   // response.redirect(results.url);
// }
// );
async function form(request, response) {
  try {
    request.body = {
      name: 'nizaqat ali',
      email: 'gamebird604@gmail.com',
      company: 'alpha'
    };

    await checkToken(request);
    let envelopesApi = getEnvelopesApi(request);
    let envelope = makeEnvelope(
      request.body.name,
      request.body.email,
      request.body.company
    );
    let results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
      envelopeDefinition: envelope,
    });
    let viewRequest = await makeRecipientViewRequest(
      request.body.name,
      request.body.email
    );
    console.log(viewRequest, "viewRequest");
    console.log(results.envelopeId, 'envelope Id');
    results = await envelopesApi.createRecipientView(
      process.env.ACCOUNT_ID,
      results.envelopeId,
      {
        recipientViewRequest: {
          returnUrl: viewRequest.returnUrl,
          email: viewRequest.email,
          userName: viewRequest.userName,
          authenticationMethod: viewRequest.authenticationMethod,
          clientUserId: 1000,
          frameAncestors: [
            "http://localhost:8000",
            "https://apps-d.docusign.com"
          ],
          messageOrigins: [
            "https://apps-d.docusign.com"
          ]
        },
      }
    );
    console.log(results.url);
    const url = results.url;
    // Sending the URL in the response
    response.status(200).json({ url });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
app.get('/initiate-docusign', (req, res) => {
  res.json({data:{
    recipientViewUrl:url
  }});
});

function getEnvelopesApi(request) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(process.env.BASE_PATH);
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + request.session.access_token
  );
  return new docusign.EnvelopesApi(dsApiClient);
}

function makeEnvelope(name, email, company) {
  let env = new docusign.EnvelopeDefinition();
  env.templateId = process.env.TEMPLATE_ID;
  let text = docusign.Text.constructFromObject({
    tabLabel: "company_name",
    value: company,
  });

  // Pull together the existing and new tabs in a Tabs object:
  let tabs = docusign.Tabs.constructFromObject({
    textTabs: [text],
  });

  let signer1 = docusign.TemplateRole.constructFromObject({
    email: email,
    name: name,
    tabs: tabs,
    clientUserId: process.env.CLIENT_USER_ID,
    roleName: "Applicant",
  });

  env.templateRoles = [signer1];
  env.status = "sent";

  return env;
}

async function makeRecipientViewRequest(name, email) {
  let viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = "http://localhost:3000/strip";
  viewRequest.authenticationMethod = "none";

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = email;
  viewRequest.userName = name; // Use 'userName' instead of 'name'
  viewRequest.clientUserId = "fce6df83-b77c-4b10-952c-64abf5740f41";
  // Optional: Set clientUserId if needed
  // viewRequest.clientUserId = process.env.CLIENT_USER_ID;
console.log("pakistannnnnnnnnnnnnnn",viewRequest)
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
        "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAgABwCAvllENfrbSAgAgD6-PMgR3EgCAIPf5vx8txBLlSxkq_V0D0EVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAAGY1ZjAwMzExLTAyMzYtNGRiYS05Yzk0LWE5Y2UxM2NmNmI1NiIAJAAAAGY1ZjAwMzExLTAyMzYtNGRiYS05Yzk0LWE5Y2UxM2NmNmI1NjAAAID7Ejz220g3AC1YUzmtcd9LtcjvLYoCXoM.UdoF--2wLQq0INMbMxyAGfRpNRJsLrKy4ylXxQ0BCX8azl_sfTJ_kvICmfwAv9eYC8qzdoUGETh0drL11dTVlmcQD6qRd73LQXW_p6F8T-B-zpu9-JPPK5EjTLM-8ykaXCRmiNFqxRuC5ZlyeRrEpRuwXzXc3779SLo6lkt3xwXv3ltVT4N2D3m92I764LRwRJcq5qK2fygFuaMWgh6siqERGi8MYQPP2_g_-3OSHPx4-fOhtn8xqPzq4Azo_FMJ62JOnrIPfNK5lVvgKzgcZMbLsCgoYaCh01rup9JILBG2QhsmRUXHGjJL6lnEAYHt0BZEIQPECdMpTdF3qI6S0g",
    };

    const headers = {
      Authorization:
        "Basic ZjVmMDAzMTEtMDIzNi00ZGJhLTljOTQtYTljZTEzY2Y2YjU2OmRkYjZkMmRhLTJjYzAtNGM0Yi04MjdmLTcxNzVjYWJhYTM0MQ==",
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
async function focusedView(url) {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const window = dom.window;
  const INTEGRATION_KEY = 'f5f00311-0236-4dba-9c94-a9ce13cf6b56';

  try {
    const docusignInstance = await window.DocuSign.loadDocuSign(INTEGRATION_KEY);
    const signing = docusignInstance.signing({
      url: url,
      displayFormat: 'focused',
      style: {
        branding: {
          primaryButton: {
            backgroundColor: '#333',
            color: '#fff',
          },
        },
        signingNavigationButton: {
          finishText: 'Custom Button Text',
          position: 'bottom-left',
        },
      },
    });

    signing.on('ready', (event) => {
      console.log('UI is rendered');
    });

    signing.on('sessionEnd', (event) => {
      console.log('sessionend', event);
    });

    signing.mount('#agreement'); // Assuming '#agreement' is the container ID where DocuSign will be displayed
  } catch (error) {
    console.error('Error loading DocuSign:', error);
  }
}
async function downloadSignedDocuments(body) {
  const name=body.name;
  const envelopeId=body.envalopId;
   await checkToken(request);
    // Create DocuSign API client
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath('https://demo.docusign.net/restapi');
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + request.session.access_token);
  
  
    // Create Envelopes API instance
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  
    try {
      // Get envelope information
      const envelope = await envelopesApi.getEnvelope(ACCOUNT_ID, envelopeId);
  
      // Loop through documents and download each one
      console.log(envelope);
      // let results = await envelopesApi.listDocuments(ACCOUNT_ID, envelopeId, null); //geting list of documents
      const documentId='archive';
      const results = await envelopesApi.getDocument(ACCOUNT_ID, envelopeId, documentId, {});
      const documentData = results;
  
      // Replace 'output.pdf' with the desired file name
      const filePath = `${name}.zip`;

      // Convert the base64-encoded document data to a buffer
      const zipBuffer = Buffer.from(documentData, 'binary');
      // Buffer.from(STRING, 'binary')

// Write the buffer to a file
fs.writeFileSync(filePath, zipBuffer);

console.log(`File saved at: ${filePath}`);
  
      console.log('Documents downloaded successfully.');
    } catch (error) {
      console.error('Error downloading documents:', error);
    }
  }



  async function getDocumentIds(envelope) {
    const documentsUri = envelope.documentsUri;
  
    try {
      const response = await axios.get(documentsUri, {
        headers: {
          'Authorization': 'Bearer ' + request.session.access_token
        },
      });
      console.log(response);
      const documents = response.data.documents || [];
  
      // Extract document IDs
      const documentIds = documents.map(document => document.documentId);
  
      console.log('Document IDs:', documentIds);
      return documentIds;
    } catch (error) {
      console.error('Error retrieving document IDs:', error);
      return [];
    }
  }
  async function getTemplateDetails(envelope) {
    const templateUri = envelope.templateUri;
  
    try {
      const response = await axios.get(templateUri, {
        headers: {
          'Authorization': 'Bearer ' + request.session.access_token, 
        },
      });
  
      const templateDetails = response.data;
  
      // Extract document details from the template response
      const documentDetails = templateDetails.documents || [];
  
      console.log('Document Details:', documentDetails);
      return documentDetails;
    } catch (error) {
      console.error('Error retrieving template details:', error);
      return [];
    }
  }

module.exports={form,downloadSignedDocuments}