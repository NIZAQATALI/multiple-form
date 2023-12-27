const bcrypt = require("bcryptjs");
const userService = require("../Services/userServices");
const {formatCurrency,convertToNumeric} = require("../Services/helperMethods.js");
const FormData = require('form-data');
const hubspot = require('@hubspot/api-client');
const companyService = require('../Services/companyService.js');
const nodemailer = require('nodemailer');
const userModel = require("../modals/userModel");
const auth = require("../MiddleWares/auth");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Readable } = require('stream');
var db = require('../modals/index.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
// var db = require('../Images');
// image Upload
const multer = require('multer')
const path = require('path');
const { response } = require("express");
const { json } = require("body-parser");
const e = require("express");
var  User =  db.userModel;
//user   registration, updation(on the  bases  of  existing  user ) and  login  
// const register = async (req, res) => {
//   const { email } = req.body;
//   // Check if the user with the provided email already exists
//   const existingUser = await User.findOne({ where: { email } });
//   if (existingUser && (existingUser.applicationStatus == null||existingUser.applicationStatus==false)) {
//     // User with the email already exists, update the user
//     await userService.updateUser(existingUser.id, req.body);
//     return res.status(200).send({ message: "User updated successfully!"});
//   } else {
//     // User doesn't exist, proceed to register a new user
//     await userService.register(req.body, async (err, result) => {
//       if (err) return res.status(400).send(err);
//       // Log in the newly registered user
//       await userService.login(email, async (loginErr, loginResult) => {
//         if (loginErr) return res.status(400).send(loginErr);
//         loginResult.token = auth.generateToken(
//           loginResult.id.toString(),
//           loginResult.email
//         );
//         return res.status(201).send({
//           message: "User registered and logged in successfully!",
//           user: loginResult,
//         });
//       });
//     });
//   }
// };

// const register = async  (req, res) => {
//   const { email, } = req.body;
//   const { business_name,trade_name,address_line_1,city,state,address_line_2,zip } = req.body;
// 		const companyData={ business_name,trade_name,address_line_1,city,state,address_line_2,zip }
//     // Check if the user with the provided email already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       // User with the email already exists, update the user
//       await userService.updateUser(existingUser.id, req.body);
//       return res.status(200).send({ message: "User updated successfully!" });
//     } else {
//         // User doesn't exist, proceed to register a new user
//     await userService.register(req.body, async(err, result) => {
//       if (err) return res.status(400).send(err);
//       // Log in the newly registered user
//    await  userService.login(email, async(loginErr, loginResult) => {
//         if (loginErr) return res.status(400).send(loginErr);
//         loginResult.token = auth.generateToken(loginResult.id.toString(), loginResult.email);
//   // Call the companyService.create function here
//    await companyService.create(companyData, loginResult.id, (companyErr, createdCompany) => {
//     if (companyErr) {
//       return res.status(500).send({ message: "Error creating company", details: companyErr.message });
//     }
//     return res.status(201).send({ message: "User registered and logged in successfully and  Also  Company  is  Created  successfully!", user: loginResult, company: createdCompany });
// });
//       });
//     });
// }};
const register = async (req, res) => {
  const { email } = req.body;
  
  // Check if the user with the provided email already exists
  const existingUser = await User.findOne({ where: { email } });
 
  if (existingUser && (existingUser.applicationStatus == null || existingUser.applicationStatus == false)) {
    // User with the email already exists, return an error
    return res.status(400).send({ message: "User with this email already exists and cannot be updated." });
  } else {
    // User doesn't exist, proceed to register a new user
    await userService.register(req.body, async (err, result) => {
      if (err) return res.status(400).send(err);
      // Log in the newly registered user
      await userService.login(email, async (loginErr, loginResult) => {
        if (loginErr) return res.status(400).send(loginErr);
        loginResult.token = auth.generateToken(
          loginResult.id.toString(),
          loginResult.email
        );
        return res.status(201).send({
          message: "User registered and logged in successfully!",
          user: loginResult,
        });
      });
    });
  }
};
const registerViaInvite = async  (req, res) => {
  const token = req.query.token;
  const invitationToken = jwt.decode(token);
  const {  email, name ,surname,  password } = req.body;
 const Invited_Email = invitationToken.id
 console.log("entered Email",email);
  console.log("Invited Email",Invited_Email);
  if (Invited_Email== email) {
 if (!(name && surname && email && password))
    return res
      .status("400")
      .send({ errMessage: "Please fill all required areas!" });
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.password = hashedPassword;
  await userService.register(req.body, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(201).send(result);
  });
  } else {
    return res
      .status("400")
      .send({ errMessage: `Please Enter Same  Email :${Invited_Email} on which  your   Invited!` });
  }
  // if (!(name && surname && email && password))
  //   return res
  //     .status("400")
  //     .send({ errMessage: "Please fill all required areas!" });
  // const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(password, salt);
  // req.body.password = hashedPassword;
  // await userService.register(req.body, (err, result) => {
  //   if (err) return res.status(400).send(err);
  //   return res.status(201).send(result);
  // });
};
const login = async (req, res) => {
  const {email} = req.body;
  await userService.login(email, (err, result) => {
        console.log("result.....",result);
     result.token = auth.generateToken(result.id.toString(), result.email);
    return res
      .status(200)
      .send({ message: "User login successful!", user: result });
  });
};
const getUser = async (req, res) => {
  const userId =   req.user.id;
  console.log("userId......",userId);
  await userService.getUser(userId, (err, result) => {
    if (err) return res.status(404).send(err);
    result.password = undefined;
    return res.status(200).send(result);
  });
};
const getById = async (req, res) => {
  const userId =   req.body.userId;
  console.log("userId......",userId);
  await userService.getById(userId, (err, result) => {
    if (err) return res.status(404).send(err);
    result.password = undefined;
    return res.status(200).send(result);
  });
};
const getAllFiles = async (req, res) => {
  const userId =   req.user.id;
  await userService.getAllFiles(userId, (err, result) => {
    if (err) return res.status(404).send(err);
    result.password = undefined;
    return res.status(200).send(result);
  });
};
const getAllUser = async (req, res) => {
  await userService.getAllUser( (err, result) => {
    if (err) return res.status(404).send(err);
    return res.status(200).send(result);
  });
};
const getUserWithMail = async(req,res) => {
  const {email} = req.body;
  await userService.getUserWithMail(email,(err,result)=>{
    if(err) return res.status(404).send(err);
    const dataTransferObject = {
      user: result.id,
      name: result.name,
      surname: result.surname,
      color: result.color,
      email : result.email
    };
    return res.status(200).send(dataTransferObject);
  })
}
// const updateUser = async (req, res) => {
//     try {   
// const id=req.user.id;
// let step=req.params.stepNumber;
// const nextstep = req.params.stepNumber;
// const prevstep = req.user.step;
//  step = (nextstep >= prevstep) ? nextstep : prevstep;

//       const updatedUser = await userService.updateUser(id, {...req.body,step:step});
//  // Now it should be defined
//       res.status(200).json(updatedUser);
//     } catch (err) {
//       res.status(500).json(err);
//     }
// };
const updateUser = async (req, res) => {
  try {
      const id = req.user.id;
      let step = req.params.stepNumber;
      const nextstep = req.params.stepNumber;
      const prevstep = req.user.step;
      step = (nextstep >= prevstep) ? nextstep : prevstep;
      // Check if user.applicationStatus is true
      if (req.user.applicationStatus) {
          return res.status(400).json({ error: 'You have already submitted documents. Data cannot be updated.' });
      }
      const updatedUser = await userService.updateUser(id, { ...req.body, step: step });
      // Now it should be defined
      res.status(200).json(updatedUser);
  } catch (err) {
      res.status(500).json(err);
  }
};
const updateApplication = async (req, res) => {
  try {
      // Check if user.applicationStatus is true
      if (req.user.applicationStatus) {
          return res.status(400).json({ error: 'You have already submitted documents. Data cannot be updated.' });
      }
   const id  = req.user.id;
      const updatedUser = await userService.updateApplication(id);
      // Now it should be defined
      res.status(200).json(updatedUser);
  } catch (err) {
      res.status(500).json(err);
  }
};
const updateDocumentStaus = async (req, res) => {
  try {
      // Check if user.applicationStatus is true
      if (req.user.applicationWithDocument) {
          return res.status(400).json({ error: 'You have already submitted documents. Data cannot be updated.' });
      }
   const id  = req.user.id;
      const updatedUser = await userService.updateDocumentStatus(id);
      // Now it should be defined
      res.status(200).json(updatedUser);
  } catch (err) {
      res.status(500).json(err);
  }
};
const updateDocumentStatus = async (req, res) => {
  try {
      // Check if user.applicationStatus is true
      if (req.user.applicationWithDocument) {
          return res.status(400).json({ error: 'You have already submitted documents' });
      }
   const id  = req.user.id;
      const updatedUser = await userService.updateDocumentStaus(id);
      // Now it should be defined
      res.status(200).json(updatedUser);
  } catch (err) {
      res.status(500).json(err);
  }
};
const uploadForm = async (req, res) => {
  try {
const id=req.user.id;
const updatedUserFiles = {};
//Add files to the updatedUserFiles object only if they are present in the request
if (req.files.schedule_pdf) {
  updatedUserFiles.schedule_pdf_name = req.files.schedule_pdf[0].originalname;
  updatedUserFiles.schedule_pdf = req.files.schedule_pdf[0].path
}
console.log("UpdatedUserFiles",req.files.schedule_pdf);
  if (req.files.schedule_pdf) {   
console.log("UpdatedUserFiles 7777",updatedUserFiles);
      const uniqueIdentifier = req.files.schedule_pdf[0].path;
      updatedUserFiles.schedule_pdf = uniqueIdentifier;
    }
console.log("UpdatedUserFiles",updatedUserFiles);
console.log("UpdatedUserFiles",updatedUserFiles.schedule_pdf_name);
if (req.files.driving_licence) {
  updatedUserFiles.driving_licence_name = req.files.driving_licence[0].originalname;
  updatedUserFiles.driving_licence = req.files.driving_licence[0].path;
}
if (req.files.FormA1099) {
  updatedUserFiles.FormA1099_name = req.files.FormA1099[0].originalname;
  updatedUserFiles.FormA1099 = req.files.FormA1099[0].path;
}
if (req.files.FormB1099) {
  updatedUserFiles.FormB1099_name = req.files.FormB1099[0].originalname;
  updatedUserFiles.FormB1099 = req.files.FormB1099[0].path;
}
if (req.files.ks22020) {
  updatedUserFiles.ks22020_name = req.files.ks22020[0].originalname;
  updatedUserFiles.ks22020 = req.files.ks22020[0].path;
}
if (req.files.ks2020) {
  updatedUserFiles.ks2020_name = req.files.ks2020[0].originalname;
  updatedUserFiles.ks2020 = req.files.ks2020[0].path;
}
if (req.files.Tax_Return_2020) {
  updatedUserFiles.Tax_Return_2020_name = req.files.Tax_Return_2020[0].originalname;
  updatedUserFiles.Tax_Return_2020 = req.files.Tax_Return_2020[0].path;
}
if (req.files.Tax_Return_2021) {
  updatedUserFiles.Tax_Return_2021_name = req.files.Tax_Return_2021[0].originalname;
  updatedUserFiles.Tax_Return_2021 = req.files.Tax_Return_2021[0].path;
}
if (req.files.supplemental_attachment_2020) {
  updatedUserFiles.supplemental_attachment_2020_name = req.files.supplemental_attachment_2020[0].originalname;
  updatedUserFiles.supplemental_attachment_2020 = req.files.supplemental_attachment_2020[0].path;
}
if (req.files.supplemental_attachment_2021) {
  updatedUserFiles.supplemental_attachment_2021_name = req.files.supplemental_attachment_2021[0].originalname;
  updatedUserFiles.supplemental_attachment_2021 = req.files.supplemental_attachment_2021[0].path;
}
console.log("updated user files:",updatedUserFiles)
    const updatedUser = await userService.uploadForm(id,{...req.body,...updatedUserFiles,} );
// Now it should be defined
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
const uploadFormMOre = async (req, res) => {
  try {
    const id = req.user.id;
    const updatedUserFiles = {};
    // Process each field to handle multiple files
    Object.keys(req.files).forEach((field) => {
      const files = req.files[field];
      if (files) {
        updatedUserFiles[`${field}_name`] = files.map((file) => file.originalname);
        updatedUserFiles[field] = files.map((file) => file.path);
      }
    });
    console.log(updatedUserFiles,"updatedUserFiles",updatedUserFiles);
    const updatedUser = await userService.uploadForm(id, { ...req.body, ...updatedUserFiles });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
const uploadfordashboard = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUserFiles = {};
    // Process each field to handle multiple files
    Object.keys(req.files).forEach((field) => {
      const files = req.files[field];
      if (files) {
        updatedUserFiles[`${field}_name`] = files.map((file) => file.originalname);
        updatedUserFiles[field] = files.map((file) => file.path);
      }
    });
    console.log(updatedUserFiles,"updatedUserFiles",updatedUserFiles);
    const updatedUser = await userService.uploadForm(id, { ...req.body, ...updatedUserFiles });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
const checkEmail = async (req, res) => { 
  try {
    const { email } = req.body;
    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If the user already exists, send a custom error response
      return res.status(400).json({ error: 'User with this email already exists.' });
    } else {
      // If the user doesn't exist, send a success message
      return res.status(200).json({ message: 'Email is available.' });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 const sendotp = async (req, res) => {
  console.log(req.body)
  const _otp = `S-${Math.floor(100000 + Math.random() * 900000)}`
  let user = await User.findOne(  {
    where: {
      email: req.body.email,
    },
  })
  if (!user) {
    return res.status(500).json({ code: 500, message: 'User not found' });
  }
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUR_EMAIL,
        pass: process.env.EMAIL_PASSWORD 
      }
  })
  let info = await transporter.sendMail({
      from: 'afaq58681@gmail.com',
      to: req.body.email, // list of receivers
      subject: "OTP", // Subject line
      text: String(_otp),
  })
  if (info.messageId) {
      console.log(info, 84)
      if (info.messageId) {
        console.log(info, 84);
        // await user.update({
        //   otp: _otp,
        //   otpUsed: false,
        // });
        // Update the user's OTP and set otpUsed to false
await User.update(
  {
    otp: _otp,
    otpUsed: false,
  },
  {
    where: {
      id: user.id, 
    },
  }
);    res.status(200).json({ code: 200, message: 'OTP sent' });
      } else {
        res.status(500).json({ code: 500, message: 'Server error' });
      }
    } 
}
const submitotp = async (req, res) => {
  try {
   // Assuming you have the password in the request body
    // const result = await User.findOne({  where: {
    //   otp: req.body.otp,
    // }, });
    const result = await User.findOne({
      where: {
        otp: req.body.otp,
      },
    });
    if (!result) {
      return res.status(404).json({ code: 404, message: 'OTP not found' });
    }
    if (result.otpUsed) {
      return res.status(400).json({ code: 400, message: 'OTP already used' });
    }
    // Mark the OTP as used and update the password
   // Update the record where email matches and otpUsed is false
const updatedResult = await User.update(
  { otpUsed: true},
  {
    where: {
      email:result.email,
      otpUsed: false
    }
  }
);
// if (updatedResult[0] === 1) {

//   return res.status(200).json({ code: 200, message: 'Password updated' });
// } else {
//   return res.status(404).json({ code: 404, message: 'Email not found or OTP has already been used' });
// }
    // Call the login function to log in the user
    await userService.login(result.email, async (loginErr, loginResult) => {
      if (loginErr) {
        return res.status(400).json({ code: 400, message: 'Login failed after OTP verification', error: loginErr });
      }
      // Attach the generated token to the login result
      loginResult.token = auth.generateToken(
        loginResult.id.toString(),
        loginResult.email
      );
      // Send the response with the logged-in user details
      return res.status(200).json({
        code: 200,
        message: ' User logged in successfully',
        user: loginResult,
      });
    });
} catch (err) {
console.error(err); // Log the error for debugging
return res.status(500).json({ code: 500, message: 'Server error' });
}
};
const sendInvitation = async (req, res) => {
  console.log(req.body);
const{ email} = req.body
  // Generate a unique invitation token or link for registration.
  // You can use a library like `uuid` or generate a token with some data.
  const invitationToken = auth.generateToken(email); // Implement this function
  console.log(invitationToken);
  const decodedToken = jwt.decode(invitationToken);
  console.log(decodedToken)
  // Create a link for registration. This link should contain the invitation token.
  const registrationLink = ` http://localhost:3000/registerWithInvite?token=${invitationToken}`;
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUR_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: 'hafiznizaqatali@gmail.com',
    to: req.body.email, // List of receivers
    subject: 'Invitation to Register', // Subject line
    text: `Click on the following link to register: ${registrationLink}  `,
    html: `Click on the following link to register: <a href="${registrationLink}">${registrationLink}</a>`,
  });

  if (info.messageId) {
    User
      .update( { invitationToken },{ where:{email: req.body.email} },)
      .then(result => {
        res.send({ code: 200, message: 'Invitation sent' });
      })
      .catch(err => {
        res.send({ code: 500, message: 'Server error' });
      });
  } else {
    res.send({ code: 500, message: 'Server error' });
  }
};

//  const submitotp = (req, res) => {
//   console.log(req.body)


//   userModel.findOne({ otp: req.body.otp }).then(result => {

//       //  update the password 

//       userModel.updateOne({ email: result.email }, { password: req.body.password })
//           .then(result => {
//               res.send({ code: 200, message: 'Password updated' })
//           })
//           .catch(err => {
//               res.send({ code: 500, message: 'Server err' })

//           })


//   }).catch(err => {
//       res.send({ code: 500, message: 'otp is wrong' })

//   })
// }
// 8. Upload Image Controller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: '5000000'},
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|pdf/
      const mimeType = fileTypes.test(file.mimetype)  
      const extname = fileTypes.test(path.extname(file.originalname))
      if(mimeType && extname) {
          return cb(null, true)
      }
      cb('Give proper files formate to upload')
  }
}).fields([
  { name: 'schedule_pdf',maxCount:100000},
  { name: 'driving_licence',maxCount:100000},
  { name: 'FormA1099',maxCount:100000},
  { name: 'FormB1099',maxCount:100000},
  { name: 'ks22020',maxCount:100000},
  { name: 'ks2020',maxCount:100000},
  { name: 'Tax_Return_2020',maxCount:100000},
  { name: 'Tax_Return_2021',maxCount:100000},
  { name: 'supplemental_attachment_2020',maxCount:100000},
  { name: 'supplemental_attachment_2021',maxCount:100000},
  // Add more fields as needed
])
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const destinationPath = path.join(__dirname, 'Images');
//     cb(null, 'Images');
//   },
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname))
//   }
// })
const uploadOne = multer({
  storage: storage,
  limits: { fileSize: '5000000' },
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif|pdf/
      const mimeType = fileTypes.test(file.mimetype)  
      const extname = fileTypes.test(path.extname(file.originalname))
      if(mimeType && extname) {
          return cb(null, true)
      }
      cb('Give proper files formate to upload')
  }
}).single('schedule_pdf')
//.fields([{ name: 'driving_licence', maxCount: 1 }, { name: 'FormA1099_name', maxCount: 1 },, { name: 'FormB1099_name', maxCount: 1 }, { name: 'ks22020', maxCount: 1 }, { name: 'ks2020', maxCount: 1 }, { name: 'Tax_Return_2020', maxCount: 1 }, { name: 'Tax_Return_2021', maxCount: 1 }, { name: 'supplemental_attachment_2020', maxCount: 1 }, { name: 'supplemental_attachment_2021', maxCount: 1 }, { name: 'supplemental_attachment_2021', maxCount: 1 }]);
const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    // Assuming you have a service method for updating application status
    const updatedStatus = await userService.updateApplicationStatus(userId, req.body.applicationStatus);
    res.status(200).json(updatedStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Define the removeFile controller function
// const removeFile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("objectnjnjjjjnjjjnjn",userId)
//     const {schedule_pdf,driving_licence} = req.body
//     if(schedule_pdf){
//  req.user.schedule_pdf=null
//  req.user.schedule_pdf_name=null

//     }
//     console.log("schedule_pdf",schedule_pdf,"driving_licence",driving_licence)
   
//     let fileName;
//     if(driving_licence){
   
//      fileName = path.basename(schedule_pdf);
//     }
//     // Construct the file path
//     const filePath = path.join(__dirname, '../Images', fileName); // Adjust the path based on your project structure
//     // Check if the file exists
//     console.log(filePath)
//     if (fs.existsSync(filePath)) {
//      console.log("File Path....",filePath);
//      // Extract the file name from the full path
// const fileName = path.basename(filePath);
// console.log("filenamee",fileName)
//       // Remove the file
//       fs.unlinkSync(filePath);
//        // Update your database to remove the file reference
//       res.status(200).json({ message: 'File removed successfully.' });
//     } else {
//       res.status(404).json({ error: 'File not found.' });
//     }
//   } catch (err) {
//     console.error('Error removing file:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const removeFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fieldToDelete } = req.body;
console.log(fieldToDelete,"field to delete")
    if (!fieldToDelete) {
      return res.status(400).json({ error: 'Field to delete is required.' });
    }
    // Assuming you are using some kind of database model (e.g., Mongoose)
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Check if the specified field exists in the user's document
    console.log("user[fieldToDelete]",user[fieldToDelete])
    if (user[fieldToDelete]) {
      // Extract the file name from the full path
      const fileName = path.basename(user[fieldToDelete]);
      // Construct the file path
      const filePath = path.join(__dirname, '../Images', fileName);
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Remove the file
        fs.unlinkSync(filePath);
        // Update the database field
        user[fieldToDelete] = null;
        // Assuming you have a field named schedule_pdf_name in your model
        user[`${fieldToDelete}_name`] = null;
        await user.save(); // Save the changes to the database
        res.status(200).json({ message: 'File removed successfully.' });
      } else {
        res.status(404).json({ error: 'File not found.' });
      }
    } else {
      res.status(400).json({ error: `Field ${fieldToDelete} is  Already deleted or  empty.` });
    }
  } catch (err) {
    console.error('Error removing file:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// const deleteFileHandler = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const fieldName = req.params.fieldName;
//     const fileName = req.params.fileName;

//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if the field exists and is an array
//     if (Array.isArray(user[fieldName]) && user[fieldName].length > 0) {
//       // Find the index of the file in the array
//       const fileIndex = user[fieldName].indexOf(fileName);

//       // If the file is found, remove it from the array
//       if (fileIndex !== -1) {
//         user[fieldName].splice(fileIndex, 1);
//         await user.save();
//         return res.status(200).json({ message: 'File deleted successfully' });
//       }
//     }

//     // If the file or field is not found, return an error
//     return res.status(404).json({ error: 'File not found or field is not an array' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const deleteFileHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const fieldName = req.body.fieldName;
    const fileName = req.body.fileName;
    const originalFieldName = req.body.originalFieldName;
    const originalName=req.body.originalName
    console.log(userId,"...2...",originalName,"..3....",originalFieldName)
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the field exists and is an array
    if (Array.isArray(user[fieldName]) && user[fieldName].length > 0) {
      // Find the index of the file in the array
      const fileIndex = user[fieldName].indexOf(fileName);
      // If the file is found, remove it from the array
      if (fileIndex !== -1) {
        console.log("fileIndex.......................",fileIndex)
        const filePath = user[fieldName][fileIndex]; // Get the file path
        console.log(filePath,"fileIndexPath")
        // Remove the file from the file system
       // await fs.unlink(filePath);
        await fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error deleting file' });
          }})
       //  Remove the file reference from the array
        user[fieldName].splice(fileIndex, 1);
        user[fieldName] = user[fieldName].filter((file) => file !== filePath); // Remove the file from the array
               // Assuming you have a field named schedule_pdf_name in your model
        user[originalFieldName] = user[originalFieldName].filter((file) => file !== originalName);
        // Save the changes to the database
        await user.save({ fields: [fieldName, originalFieldName] });
        return res.status(200).json({ message: 'File deleted successfully' });
      }
    }
    // If the file or field is not found, return an error
    return res.status(404).json({ error: 'File not found or field is not an array' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const setCFormData = async (req, res) => {
  try {
    const formData = req.body;
    const { id } = req.params;
    // Finding greater amounts
    console.log("........................................")
    function findGreaterAmount(...netIncomes) {
      return Math.max(...netIncomes);
    }
    // const greaterAmount2020 = findGreaterAmount(formData.net_income_2019, formData.net_income_2020);
    const greaterAmount2020 = findGreaterAmount(convertToNumeric(formData.net_income_2019), convertToNumeric(formData.net_income_2020));
    console.log("yyyyyyyyyyyyyyyyyy",(formData.net_income_2019))
    // const greaterAmount2021 = findGreaterAmount(formData.net_income_2019, formData.net_income_2020, formData.net_income_2021);
 const greaterAmount2021 = findGreaterAmount(convertToNumeric(formData.net_income_2019), convertToNumeric(formData.net_income_2020), convertToNumeric(formData.net_income_2021));
    // Start Step 1 Calculation Process
    console.log("yyyyyyyyyyyyyyyyyy",convertToNumeric(formData.net_income_2019),convertToNumeric(formData.net_income_2020),convertToNumeric(formData.net_income_2021))
    const netIncomeThresholdStep1 = 132886;
    const maxSickLeaves = 10; // 10 days
    const adwThresholdStep1 = 511.10;
    const maxCreditAmountThresholdStep1 = 5111;
    const remainingNetIncome2020Step1 = (greaterAmount2020 > netIncomeThresholdStep1) ? (greaterAmount2020 - netIncomeThresholdStep1) : 0;
    const remainingNetIncome2021Step1 = (greaterAmount2021 > netIncomeThresholdStep1) ? (greaterAmount2021 - netIncomeThresholdStep1) : 0;
    console.log("remainingNetIncome2020Step1",remainingNetIncome2020Step1,"remainingNetIncome2021Step1",remainingNetIncome2021Step1);
    console.log("1days",formData['1days'])
       console.log("2days",formData['2days'])
    const leaveDays2020Step1 = Math.min(maxSickLeaves, formData['1days']);
    const leaveDays2021Step1 = Math.min(maxSickLeaves, formData['2days']);
       // Assuming you have the values defined for leave_days_2020_step_1, leave_days_2021_step_1, and max_sick_leaves
let remaining_leave_days_2020_step_1 = (leaveDays2020Step1 > maxSickLeaves) ? leaveDays2020Step1 - maxSickLeaves : null;
let remaining_leave_days_2021_step_1 = (leaveDays2021Step1 > maxSickLeaves) ? leaveDays2021Step1 - maxSickLeaves : null;
    const adw2020Step1 = (greaterAmount2020 > netIncomeThresholdStep1) ? netIncomeThresholdStep1 / 260 : greaterAmount2020 / 260 ;
    const adw2021Step1 = (greaterAmount2021 > netIncomeThresholdStep1) ? netIncomeThresholdStep1 / 260 : greaterAmount2021/260;
   console.log("adw2020Step1",adw2020Step1)
    console.log("adw2020Step1",adw2021Step1)
    const creditAmount2020Step1 = parseFloat((adw2020Step1 * leaveDays2020Step1).toFixed(1));
    const creditAmountRemaining2020Step1 = (creditAmount2020Step1 > maxCreditAmountThresholdStep1) ? creditAmount2020Step1 - maxCreditAmountThresholdStep1 : 0;
    const creditAmount2020Step1Final = (creditAmount2020Step1 > maxCreditAmountThresholdStep1) ? maxCreditAmountThresholdStep1 : creditAmount2020Step1;
    const creditAmount2021Step1 = parseFloat((adw2021Step1 * leaveDays2021Step1).toFixed(1));
    const creditAmountRemaining2021Step1 = (creditAmount2021Step1 > maxCreditAmountThresholdStep1) ? creditAmount2021Step1 - maxCreditAmountThresholdStep1 : 0;
    const creditAmount2021Step1Final = (creditAmount2021Step1 > maxCreditAmountThresholdStep1) ? maxCreditAmountThresholdStep1 : creditAmount2021Step1;
// console.log("creditAmount2020Step1",creditAmount2020Step1)
// console.log("creditAmountRemaining2020Step1",creditAmountRemaining2020Step1)
// console.log("creditAmount2021Step1",creditAmount2021Step1)
// console.log("creditAmount2020Step1Final",creditAmount2020Step1Final)
// console.log("creditAmountRemaining2021Step1",creditAmountRemaining2021Step1)
// console.log("creditAmount2021Step1Final",creditAmount2021Step1Final)
console.log("Data of  step  1  ")
console.log("net_income_2019:", formData.net_income_2019);
console.log("net_income_2020:", formData.net_income_2020);
console.log("net_income_2021:", formData.net_income_2021);
console.log("net_income_threshold_step_1:",netIncomeThresholdStep1);
console.log("greater_amount_2020:", greaterAmount2020);
console.log("greater_amount_2021:", greaterAmount2021);
console.log("remaining_net_income_2020_step_1:", creditAmountRemaining2020Step1);
console.log("remaining_net_income_2021_step_1:", creditAmountRemaining2021Step1);
console.log("credit_amount_2020_step_1:", creditAmount2020Step1);
console.log("credit_amount_2021_step_1:", creditAmount2021Step1);
console.log("credit_amount_remaining_2020_step_1:", creditAmountRemaining2020Step1);
console.log("credit_amount_remaining_2021_step_1:", creditAmountRemaining2021Step1);
console.log("adw_2020_step_1:", adw2020Step1);
console.log("adw_2021_step_1:", adw2021Step1);
console.log("max_credit_amount_threshold_step_1:", maxCreditAmountThresholdStep1);
console.log("applied_leave_days_2020_step_1:", formData['1days']);
console.log("applied_leave_days_2021_step_1:", formData['2days']);
console.log("leave_days_2020_step_1:", leaveDays2020Step1);
console.log("leave_days_2021_step_1:", leaveDays2021Step1);

//  //end  of  step1 calculation
 // Start Step 2 Calculation Process
const net_income_threshold_step_2 = 77480;
const adw_threshold_step_2 = 298;
const max_credit_amount_threshold_step_2 = 2000;
const remaining_net_income_2020_step_2 = (greaterAmount2020 > net_income_threshold_step_2) ? (greaterAmount2020 - net_income_threshold_step_2) : 0;
const remaining_net_income_2021_step_2 = (greaterAmount2021 > net_income_threshold_step_2) ? (greaterAmount2021 - net_income_threshold_step_2) : 0;
const leave_days_2020_step_2 = parseInt(formData['3days']);
const leave_days_2021_step_2 = parseInt(formData['4days']);
let step_2_leave_calculate_2020;
if (leaveDays2020Step1 < maxSickLeaves) {
    step_2_leave_calculate_2020 = (leaveDays2020Step1 + leave_days_2020_step_2 >= maxSickLeaves) ?
        maxSickLeaves - leaveDays2020Step1 :
         leave_days_2020_step_2;
} else {
    step_2_leave_calculate_2020 = 0;
}
let step_2_leave_calculate_2021;
if (leaveDays2020Step1 < maxSickLeaves) {
    step_2_leave_calculate_2021 = (leaveDays2021Step1 + leave_days_2021_step_2 >= maxSickLeaves) ?
        maxSickLeaves - leaveDays2021Step1 :
         leave_days_2021_step_2;
} else {
    step_2_leave_calculate_2021 = 0;
}
const adw_2020_step_2 = ((greaterAmount2020 > net_income_threshold_step_2) ? net_income_threshold_step_2 : greaterAmount2020) / 260;
const adw_2021_step_2 = ((greaterAmount2021 > net_income_threshold_step_2) ? net_income_threshold_step_2 : greaterAmount2021) / 260;
const credit_amount_2020_step_2 = Math.min(max_credit_amount_threshold_step_2, parseFloat((0.67 * (adw_2020_step_2 * step_2_leave_calculate_2020)).toFixed(1)));
console.log(credit_amount_2020_step_2,"credit_amount_2020_step_2.........................................")
const credit_amount_2021_step_2 = Math.min(max_credit_amount_threshold_step_2, parseFloat((0.67 * (adw_2021_step_2 * step_2_leave_calculate_2021)).toFixed(1)));
console.log(credit_amount_2021_step_2,"credit_amount_2021_step_2.........................................")
const credit_amount_2020_step_1_and_step_2 = creditAmount2020Step1 + credit_amount_2020_step_2;
const credit_amount_2021_step_1_and_step_2 = creditAmount2021Step1 + credit_amount_2021_step_2;
const credit_amount_step_1_and_step_2 = credit_amount_2020_step_1_and_step_2 + credit_amount_2021_step_1_and_step_2;
// console.log("adw_2020_step_2",adw_2020_step_2)
// console.log("adw_2021_step_2",adw_2021_step_2)
// console.log("credit_amount_2020_step_2",credit_amount_2020_step_2)
// console.log("credit_amount_2021_step_2",credit_amount_2021_step_2)
// console.log("credit_amount_2020_step_1_and_step_2",credit_amount_2020_step_1_and_step_2)
// console.log("credit_amount_2021_step_1_and_step_2",credit_amount_2021_step_1_and_step_2)
// console.log(" credit_amount_step_1_and_step_2", credit_amount_step_1_and_step_2)
console.log("Data of  step  2  ")
console.log("net_income_threshold_step_2:", net_income_threshold_step_2);
console.log("greater_amount_2020:", greaterAmount2020);
console.log("greater_amount_2021:", greaterAmount2021);
console.log("remaining_net_income_2020_step_2:", remaining_net_income_2020_step_2);
console.log("remaining_net_income_2021_step_2:", remaining_net_income_2021_step_2);
console.log(" credit_amount_2020_step_2:", credit_amount_2020_step_2);
console.log(" credit_amount_2021_step_2:",  credit_amount_2021_step_2);
console.log("credit_amount_remaining_2021_step_1:", creditAmountRemaining2021Step1);
console.log("adw_2020_step_2:", adw_2020_step_2);
console.log("adw_2021_step_2:", adw_2021_step_2);
console.log("max_credit_amount_threshold_step_1:", max_credit_amount_threshold_step_2);
console.log("applied_leave_days_2020_step_2:", formData['3days']);
console.log("applied_leave_days_2021_step_2:", formData['4days']);
console.log("step_2_leave_calculate_2020:", step_2_leave_calculate_2020);
console.log("lstep_2_leave_calculate_2021:", step_2_leave_calculate_2021);
console.log(" credit_amount_2020_step_1_and_step_2",credit_amount_2020_step_1_and_step_2)
console.log(" credit_amount_2021_step_1_and_step_2",credit_amount_2021_step_1_and_step_2)
console.log(" credit_amount_step_1_and_step_2",credit_amount_step_1_and_step_2)
// End Step 2 Calculation Process
// Start Step 3 Calculation Process
const net_income_threshold_step_3 = net_income_threshold_step_2;
const adw_threshold_step_3 = adw_threshold_step_2;
const school_leaves_2020_threshold_step_3 = 50;
const school_leaves_2021_threshold_step_3 = 60;
const max_credit_amount_threshold_step_3 = 10000;
const remaining_net_income_2020_step_3 = (greaterAmount2020 > net_income_threshold_step_3) ? (greaterAmount2020 - net_income_threshold_step_3) : 0;
const remaining_net_income_2021_step_3 = (greaterAmount2021 > net_income_threshold_step_3) ? (greaterAmount2021 - net_income_threshold_step_3) : 0;
const leave_days_2020_step_3 = parseInt(formData['5days']);
const leave_days_2021_step_3 = parseInt(formData['6days']);
const step_3_leave_calculate_2020 = (leave_days_2020_step_3 >= school_leaves_2020_threshold_step_3) ? school_leaves_2020_threshold_step_3 : leave_days_2020_step_3;
const step_3_leave_calculate_2021 = (leave_days_2021_step_3 >= school_leaves_2021_threshold_step_3) ? school_leaves_2021_threshold_step_3 : leave_days_2021_step_3;
const adw_2020_step_3 = ((greaterAmount2020 > net_income_threshold_step_3) ? net_income_threshold_step_3 : greaterAmount2020) / 260;
const adw_2021_step_3 = ((greaterAmount2021 > net_income_threshold_step_3) ? net_income_threshold_step_3 : greaterAmount2021) / 260;
const credit_amount_2020_step_3 = Math.min(max_credit_amount_threshold_step_3, parseFloat((0.67 * (adw_2020_step_3 * step_3_leave_calculate_2020)).toFixed(1)));
const credit_amount_2021_step_3 = Math.min(max_credit_amount_threshold_step_3, parseFloat((0.67 * (adw_2021_step_3 * step_3_leave_calculate_2021)).toFixed(1)));
console.log(step_3_leave_calculate_2021,"uoggggggg")
// Assuming credit_amount_step_1_and_step_2 is defined from previous calculations
const total_credit_amount_step_3 = credit_amount_2020_step_3 + credit_amount_2021_step_3;
const final_credit_amount = total_credit_amount_step_3 + credit_amount_step_1_and_step_2;
console.log("Data  of  step  3")
console.log("credit_amount_2020_step_3",credit_amount_2020_step_3)
console.log("credit_amount_2021_step_3",credit_amount_2021_step_3)
console.log("total_credit_amount_step_3",total_credit_amount_step_3,"final_credit_amount",final_credit_amount)
// End Step 3 Calculation Process
function roundToNearestDownThousand(value) {
  return Math.floor(value / 1000) * 1000;
}

// Example usage:
const inputValue = final_credit_amount;
const roundedValue = roundToNearestDownThousand(inputValue);

console.log("rounded  value    ....................",roundedValue); 
    // ... Continue with the rest of your calculations
    // Assuming you have an AppSetczones model defined
    const updateableData = {
      net_income_2019: formatCurrency(`${formData.net_income_2019}`),
      net_income_2020: formatCurrency(`${formData.net_income_2020}`),
      net_income_2021: formatCurrency(`${formData.net_income_2021}`),
      net_income_threshold_step_1:   formatCurrency(`${netIncomeThresholdStep1}`),
      greater_amount_2020_step_1: formatCurrency(`${greaterAmount2020}`),
      greater_amount_2021_step_1: formatCurrency(`${greaterAmount2021}`),
      remaining_net_income_2020_step_1: formatCurrency(`${remainingNetIncome2020Step1}`),
      remaining_net_income_2021_step_1: formatCurrency(`${remainingNetIncome2021Step1}`) ,
      credit_amount_2020_step_1: formatCurrency(`${creditAmount2020Step1}`) ,
      credit_amount_2021_step_1: formatCurrency(`${creditAmount2021Step1}`),
      credit_amount_remaining_2020_step_1:formatCurrency(`${creditAmountRemaining2020Step1}`),
      credit_amount_remaining_2021_step_1:formatCurrency( `${creditAmountRemaining2021Step1}`),
      adw_2020_step_1:formatCurrency(`${ adw2020Step1}`),
      adw_2021_step_1: formatCurrency(`${ adw2021Step1}`),
      max_credit_amount_threshold_step_1:formatCurrency(`${ maxCreditAmountThresholdStep1}`) ,
      applied_leave_days_2020_step_1: parseInt(formData['1days']),
      applied_leave_days_2021_step_1: parseInt(formData['2days']),
      leave_days_2020_step_1: leaveDays2020Step1,
      leave_days_2021_step_1: leaveDays2021Step1,
      net_income_threshold_step_2: formatCurrency(`${ net_income_threshold_step_2}`) ,
      greater_amount_2020_step_2:formatCurrency(`${ greaterAmount2020}` ),
      greater_amount_2021_step_2: formatCurrency(`${ greaterAmount2021}` ) ,
      remaining_net_income_2020_step_2: formatCurrency(`${ remaining_net_income_2020_step_2}` ),
      remaining_net_income_2021_step_2: formatCurrency(`${ remaining_net_income_2021_step_2}` ) ,
      credit_amount_2020_step_2:formatCurrency(`${ credit_amount_2020_step_2}` ) ,
      credit_amount_2021_step_2:formatCurrency(`${ credit_amount_2021_step_2}` ),
      adw_2020_step_2: formatCurrency(`${ adw_2020_step_2}` ) ,
      adw_2021_step_2:  formatCurrency(`${ adw_2021_step_2}` ),
      applied_leave_days_2020_step_2: parseInt(formData['3days']),
      applied_leave_days_2021_step_2: parseInt(formData['4days']),
      leave_days_2020_step_2: leave_days_2020_step_2,
      leave_days_2021_step_2: leave_days_2021_step_2,
      step_2_leave_calculate_2020: step_2_leave_calculate_2020,
      step_2_leave_calculate_2021: step_2_leave_calculate_2021,
      max_credit_amount_threshold_step_2: formatCurrency(`${ max_credit_amount_threshold_step_2}` ),
      credit_amount_2020_step_2: formatCurrency(`${credit_amount_2020_step_2}` ),
      credit_amount_2021_step_2: formatCurrency(`${ credit_amount_2021_step_2}` ),
      credit_amount_2020_step_1_and_step_2: formatCurrency(`${ credit_amount_2020_step_1_and_step_2}` ) ,
      credit_amount_2021_step_1_and_step_2:  formatCurrency(`${ credit_amount_2021_step_1_and_step_2}` ),
      credit_amount_step_1_and_step_2: formatCurrency(`${ credit_amount_step_1_and_step_2}` ) ,
      net_income_threshold_step_3: formatCurrency(`${ net_income_threshold_step_3}` ) ,
      greater_amount_2020_step_3: formatCurrency(`${ greaterAmount2020}` ) ,
      greater_amount_2021_step_3:  formatCurrency(`${ greaterAmount2021}` ),
      remaining_net_income_2020_step_3: formatCurrency(`${ remaining_net_income_2020_step_3}` ) ,
      remaining_net_income_2021_step_3:  formatCurrency(`${ remaining_net_income_2021_step_3}` ),
      credit_amount_2020_step_3: formatCurrency(`${ credit_amount_2020_step_3}` ) ,
      credit_amount_2021_step_3:  formatCurrency(`${ credit_amount_2021_step_3}` ),
      adw_2020_step_3: formatCurrency(`${adw_2020_step_3}` ) ,
      adw_2021_step_3:  formatCurrency(`${ adw_2021_step_3}` ),
      applied_leave_days_2020_step_3: parseInt(formData['5days']),
      applied_leave_days_2021_step_3: parseInt(formData['6days']),
      leave_days_2020_step_3: leave_days_2020_step_3,
      leave_days_2021_step_3: leave_days_2021_step_3,
      step_3_leave_calculate_2020: step_3_leave_calculate_2020,
      step_3_leave_calculate_2021: step_3_leave_calculate_2021,
      max_credit_amount_threshold_step_3: formatCurrency(`${ max_credit_amount_threshold_step_3}` ) ,
      credit_amount_2020_step_3:  formatCurrency(`${ credit_amount_2020_step_3}` ),
      credit_amount_2021_step_3:  formatCurrency(`${ credit_amount_2021_step_3}` ),
      total_credit_amount_step_3:  formatCurrency(`${ total_credit_amount_step_3}`),
      final_credit_amount: formatCurrency(`${final_credit_amount}` ),
 
      final_roundedValue: formatCurrency(`${roundedValue}`),
    };
console.log("form__data__all",updateableData)
const updatedUser = await userService.updateCalculator(req.user.id, updateableData );
// Now it should be defined
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};
async function webhook(req,res){
  console.log(req.body);
}
const dataPosttoHubspot = async (req, res) => {
  try {
    const apiUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const accessToken = 'pat-na1-e0698d65-4c2f-4229-9c32-aadb201ed31d';

    const response = await axios.post(apiUrl, req.body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error');
  }
};
const deleteUserById = async (userId, authenticatedUserId) => {
  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (user) {
      // Check if the user ID matches the authenticated user ID
      if (user.userId === authenticatedUserId) {
        // Delete the user
        await user.destroy();
        return { success: true, message: 'User has been deleted.' };
      } else {
        return { success: false, message: 'You can delete only your account!' };
      }
    } else {
      return { success: false, message: 'User not found!' };
    }
  } catch (err) {
    // Log the error or handle it as needed
    console.error(err);
    return { success: false, message: 'Internal Server Error' };
  }
};
// const filePosttoHubspot = async (req, res) => {
//   try {
//     const hubspot = require('@hubspot/api-client')
//     const hubspotClient = new hubspot.Client({ accessToken:"pat-na1-e0698d65-4c2f-4229-9c32-aadb201ed31d" })
//     const id = req.user.id;
//     const updatedUserFiles = {};
//     console.log("iiiiiii",req.files)
//     // Check if 'schedule_pdf' file is present in the request
//     if (req.files.schedule_pdf) {
//       const file = req.files.schedule_pdf[0];
      
//       // Add file details to the updatedUserFiles object
//       updatedUserFiles.schedule_pdf_name = file.originalname;
//       updatedUserFiles.schedule_pdf = file.path;
//       const hubspotClient = new hubspot.Client({ accessToken: "your-access-token" });
//       const formData = new FormData();
//       const options = {
//         // some options
//       };
  
//       formData.append("folderPath", '/');
//       formData.append("options", JSON.stringify(options));
//       formData.append("file", await fs.readFile('file path'));  // Use fs.promises.readFile for async read
  
//       const response = await hubspotClient.apiRequest({
//         method: 'POST',
//         path: '/filemanager/api/v3/files/upload',
//         body: formData,
//         defaultJson: false
//       });
  
//       console.log(response);
// }
// return
//     // Call your service function to update the user with the file details
//    // const updatedUser = await userService.uploadForm(id, { ...req.body, ...updatedUserFiles });

//     // Send the updated user as a JSON response
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     // Handle any errors that may occur during the process
//     res.status(500).json(err);
//   }
// };
// const filePosttoHubspot = async (req, res) => {
//   try {
//     const accessToken = "pat-na1-e0698d65-4c2f-4229-9c32-aadb201ed31d"; // Replace with your actual HubSpot access token
//     const hubspotClient = new hubspot.Client({ accessToken });

//     const id = req.user.id;
//     const updatedUserFiles = {};
//     console.log("iiiiiii", req.files);

//     // Check if 'schedule_pdf' file is present in the request
//     if (req.files.schedule_pdf) {
//       const file = req.files.schedule_pdf[0];

//       // Add file details to the updatedUserFiles object
//       updatedUserFiles.schedule_pdf_name = file.originalname;
//       updatedUserFiles.schedule_pdf = file.path;

//       const formData = new FormData();
//       const options = {
//         // some options
//       };

//       formData.append("folderPath", '/');
//       formData.append("options", JSON.stringify(options));
//       formData.append("file", await fs.readFile(file.path));  // Use fs.promises.readFile for async read

//       const response = await hubspotClient.apiRequest({
//         method: 'POST',
//         path: '/filemanager/api/v3/files/upload',
//         body: formData,
//         defaultJson: false
//       });

//       console.log("yyyyyyyyyyyyPPPPPPPPPPPPPPPPPP",response);
//     }

//     // Call your service function to update the user with the file details
//     // const updatedUser = await userService.uploadForm(id, { ...req.body, ...updatedUserFiles });

//     // Send the updated user as a JSON response
  
//     return res.status(200).json(response);
//   } catch (err) {
//     // Handle any errors that may occur during the process
//     console.error('Error:', err);
//     return res.status(500).json(err);
//   }
// };
// Assuming you have an Express app instance
// const app = express();

// // Your file upload controller function  and  have  hapi  key  issue
// const  uploadFileToHubSpot = async (req, res) => {
//   const id = req.user.id;
//       const updatedUserFiles = {};
//       console.log("iiiiiii", req.files);
//   let file;
//       // Check if 'schedule_pdf' file is present in the request
//       if (req.files.schedule_pdf) {
//          file = req.files.schedule_pdf[0];
  
//         // Add file details to the updatedUserFiles object
//         updatedUserFiles.schedule_pdf_name = file.originalname;
//         updatedUserFiles.schedule_pdf = file.path;
//       }
//   //.........................................................................
//     const postUrl = 'https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=demo';
  

//     const fileOptions = {
//         access: 'PUBLIC_INDEXABLE',
//         ttl: 'P3M',
//         overwrite: false,
//         duplicateValidationStrategy: 'NONE',
//         duplicateValidationScope: 'ENTIRE_PORTAL'
//     };

//     // const formData = {
//     //     file: fs.createReadStream(file.originalname),
//     //     options: JSON.stringify(fileOptions),
//     //     folderPath: 'docs'
//     // };
//      // Read the file into a buffer
//      console.log(file,"file is  here")
//      const fileBuffer = await fs.readFile(file.path);
//      // Create a readable stream from the buffer
//      const fileStream = Readable.from(fileBuffer);
//      console.log(fileBuffer,"buffer  data")
//       // Create a FormData object
//       const formData = new FormData();
//       formData.append('file', fileBuffer, { filename: file.fileName });
//       formData.append('options', JSON.stringify(fileOptions));
//       formData.append('folderPath', 'docs');

//       const response = await axios.post(postUrl, formData, {
//         headers: {
//             ...formData.getHeaders(),
//         },
//     });
// };
// Function to upload a file to HubSpot File Manager
// async function uploadFileToHubSpot(filePath, accessToken) {
//   try {
//     const fileData = fs.readFileSync(filePath);
//     const formData = new FormData();
//     formData.append('file', fileData, {
//       filename: 'file.pdf', // Change the filename accordingly
//       contentType: 'application/pdf' // Change the content type based on your file type
//     });
//     const response = await axios.post('https://api.hubspot.com/filemanager/api/v3/files/upload', formData, {
//       headers: {
//         'Authorization': Bearer `${accessToken}`,
//         ...formData.getHeaders() // Include necessary form data headers
//       }
//     });
//     // Handle the response here
//     console.log('File upload successful:', response.data);

//     // Return the uploaded file information
//     return response.data.objects[0];
//   } catch (error) {
//     console.error('Error uploading file:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }
// // Usage example:
// const accessToken = 'pat-na1-e0698d65-4c2f-4229-9c32-aadb201ed31d'; // Replace with your HubSpot access token
// const filePath = '/'; // Replace with the path to your file

// uploadFileToHubSpot(filePath, accessToken)
//   .then(fileInfo => {
//     // Handle the uploaded file info
//     console.log('File Info:', fileInfo);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Error:', error);
//   });
// async function generatePDF(req, res) {
//   const data = req.body
//   console.log(data)
//   const doc = new PDFDocument();
//   const stream = fs.createWriteStream('receipt.pdf');
//   doc.pipe(stream);

//   doc.fontSize(14).text(`Receipt for ${data.name}`, { align: 'center' });
//   doc.moveDown();
//   doc.fontSize(12).text(`Product: ${data.productName}`);
//   doc.text(`Price: $${data.price}`);
//   doc.moveDown();
//   doc.text('Paid', { align: 'center', bold: true });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on('finish', () => {
//       console.log('PDF saved successfully.');
//       resolve('receipt.pdf');
//     });

//     stream.on('error', (error) => {
//       console.error('Error saving PDF:', error);
//       reject(error);
//     });
//   });
// }
// async function generatePDF(req, res) {
//   const data = req.body;

//   try {
//     console.log(data);

//     const pdfPath = await createPDF(data);
//     console.log('PDF saved successfully:', pdfPath);

//     res.status(200).send('PDF generated successfully.');
//   } catch (error) {
//     console.error('Error generating PDF:', error);

//     res.status(500).send('Internal Server Error');
//   }
// }

// function createPDF(data) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument();
//       const stream = fs.createWriteStream('receipt.pdf');
//       doc.pipe(stream);

//       doc.fontSize(14).text(`Receipt for ${data.name}`, { align: 'center' });
//       doc.moveDown();
//       doc.fontSize(12).text(`Product: ${data.productName}`);
//       doc.text(`Price: $${data.price}`);
//       doc.moveDown();
//       doc.text('Paid', { align: 'center', bold: true });

//       doc.end();

//       stream.on('finish', () => {
//         console.log('PDF saved successfully.');
//         resolve('receipt.pdf');
//       });

//       stream.on('error', (error) => {
//         console.error('Error saving PDF:', error);
//         reject(error);
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
async function generatePDF(req, res) {
  console.log(".............................")
  const data = req.body;

  try {
    console.log(data);
    const pdfPath = await createPDF(data);
    console.log('PDF saved successfully:', pdfPath);
    res.status(200).send('PDF generated successfully.');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
}

function createPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream('receipt.pdf');
      doc.pipe(stream);

      doc.fontSize(14).text(`Receipt for ${data.name}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Product: ${data.productName}`);
      doc.text(`Price: $${data.price}`);
      doc.moveDown();
      doc.text('Paid', { align: 'center', bold: true });
      doc.end();
      stream.on('finish', () => {
        console.log('PDF saved successfully.');
        resolve('receipt.pdf');
      });
      stream.on('error', (error) => {
        console.error('Error saving PDF:', error);
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// // Create folder API
// const createFolder = async (req, res) => {
//   try {
//     const folderData = {
//       Name: req.body.folderName, // Assuming the folder name is provided in the request body
//       Parent: {
//         Id: 'root', // Change this if you want to create the folder inside another folder
//       },
//     };
//     //const folderName = req.body.folderName;
//     const  accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTaGFyZUZpbGUiLCJzdWIiOiI1MDI1ZmMzOC04MTI4LTQxZGQtOTY2OC1kMjVmMzAzNzk0N2EiLCJpYXQiOjE3MDMxMzMxMzAsImV4cCI6MTcwMzE2MTkzMCwiYXVkIjoicEc5QmZteUpGbXcyeWQ1RE5mU0MzRXIxY25LUW50c0wiLCJzaGFyZWZpbGU6dG9rZW5pZCI6IllXc2FtWlNpdFN0WnMxdzFrcFBMVVlaMWZqS1pmT3EzJCRwR2txdkZ3QzdabFozTnNTVkIxb1UyRGp0aVpkaFdnYiIsInNjb3BlIjoidjMgdjMtaW50ZXJuYWwiLCJzaGFyZWZpbGU6c3ViZG9tYWluIjoiY2hvdWRocnljb20iLCJzaGFyZWZpbGU6YWNjb3VudGlkIjoiYThlZTQyYzYtZWVlOC04ZTI2LTQxYTQtOWE0YTIzMzVkZTRiIn0.Q2br2gntK5M2PaHjQYIkaMs-rCnckCEj1sLfYW1F8eI"
    
//      // Assuming the folder name is provided in the request body

//     // Make a request to ShareFile API to create a folder
//     const response = await axios.post('https://choudhrycom.sf-api.com/sf/v3/Items(root)/Folder', req.body, {
//       headers: {
//         Authorization: 'Bearer ' + accessToken, // Assuming you have the user's access token in req.user.accessToken
//       },
//     });

//     // You can handle the response from ShareFile as needed
//     console.log('Folder created:', response.data);

//     return res.status(200).send('Folder created successfully');
//   } catch (error) {
//     console.error('Error creating folder:', error.message);
//     return res.status(500).send('Internal Server Error');
//   }
// };
const createFolder = async (req, res) => {
  try {
    const folderData = {  
      Name: "myemail22@gamil.com",
      Parent: {
        Id: 'root',
      },
    };
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTaGFyZUZpbGUiLCJzdWIiOiI1MDI1ZmMzOC04MTI4LTQxZGQtOTY2OC1kMjVmMzAzNzk0N2EiLCJpYXQiOjE3MDMyMjExODMsImV4cCI6MTcwMzI0OTk4MywiYXVkIjoicEc5QmZteUpGbXcyeWQ1RE5mU0MzRXIxY25LUW50c0wiLCJzaGFyZWZpbGU6dG9rZW5pZCI6Ik4zNVh0Q25saVVoRHVleWRYQmZIaWFxT29DRmljdXBEJCRsblVnSzBuaGVhdVEwb3FrcElnUDBITHJlcndsOHhSRiIsInNjb3BlIjoidjMgdjMtaW50ZXJuYWwiLCJzaGFyZWZpbGU6c3ViZG9tYWluIjoiY2hvdWRocnljb20iLCJzaGFyZWZpbGU6YWNjb3VudGlkIjoiYThlZTQyYzYtZWVlOC04ZTI2LTQxYTQtOWE0YTIzMzVkZTRiIn0.59f0UQv6l4UkvXbdZ8fC_-tRHIfQipipLBkvyCHDbVg"; // Replace with your access token
    // Make a request to ShareFile API to create a folder
    const createFolderResponse = await axios.post('https://choudhrycom.sf-api.com/sf/v3/Items(root)/Folder', folderData, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    // You can handle the response from ShareFile as needed
    console.log('Folder created:', createFolderResponse.data.Id);
    // Check if the folder creation was successful before proceeding to upload the file
    if (createFolderResponse.data.Id) {
      // Call the upload file function with the created folder I
      const uploadFileResponse = await uploadFile({
        accessToken:  accessToken ,
        body: { folderId: createFolderResponse.data.Id }, // Assuming the folder ID is present in the response
      });
      // You can handle the response from the upload file function as needed
      console.log('File uploaded:');
      // Return a combined response if needed
      return res.status(200).send({
        message: 'Folder created and file uploaded successfully',
        folderId: createFolderResponse.data.Id,
      });
    } else {
      return res.status(500).send('Folder creation failed');
    }
  } catch (error) {
    console.error('Error creating folder:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};
// Upload file API
const uploadFile = async (req, res) => {
  try {
    const folderId = req.body.folderId; // Assuming the folder ID is provided in the request body
    // Assuming you're using multer or similar for file uploads
console.log("ttttttttttt",req.accessToken,folderId)
    // Make a request to ShareFile API to upload a file
    // const initialResponse = await axios.post(`https://choudhrycom.sf-api.com/sf/v3/Items(${folderId})/Upload`,{
    //   headers: {
    //     Authorization: 'Bearer ' + req.accessToken, // Assuming you have the user's access token in req.user.accessToken
      
    //   },
    // });
    const initialResponse = await axios.post(
      `https://choudhrycom.sf-api.com/sf/v3/Items(${folderId})/Upload`,
      {
        // Your request body if needed
      },
      {
        headers: {
          Authorization: 'Bearer ' + req.accessToken, // Assuming you have the user's access token in req.accessToken
          'Content-Type': 'application/json', // Adjust content type as needed
        },
      }
    );
    // Check if the initial upload was successful
    if (initialResponse) {
      // Assuming initialResponse.data.ChunkUri contains the Chunk URI
      const chunkUri = initialResponse.data.ChunkUri;
      console.log(chunkUri,"uuurrriiiii")
      // Make a second call to the Chunk URI
      // const chunkResponse = await axios.post(chunkUri, formData,
      //   {
      //     headers: {
      //       Authorization: 'Bearer ' + req.accessToken,
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      const token =req.accessToken;
      console.log(token,"accressToken")
// Create a FormData object
const formData = new FormData();
// Append the folderId
// Download the file and append it to FormData
const fileUrl = '../Images/1701167991709.png';
const fileName ="1701232864187.pdf"
const filefs=fs.readFileSync(fileUrl);
console.log(filefs,'.................fs');
// const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
 //const fileBuffer = Buffer.from(response.data);
// console.log("object..........................................",fileBuffer)
formData.append(folderId,filefs, { filename: fileName });
      const chunkResponse = await axios.post(
        chunkUri,
        formData,
        {
          headers: {
            Authorization: `Bearer ${req.accessToken}`, // Assuming you have the user's access token in req.accessToken
            // ...formData.getHeaders(), // Include FormData headers
            "Content-Type": "multipart/form-data"
          },
        }
      );
        console.log("chunkResponse->",chunkResponse)
      // Check if the chunk upload was successful
      if (chunkResponse) {
        console.log('File uploaded successfully');
        return res.status(200).send('File uploaded successfully');
      } else {
        console.error('Error uploading chunk:', chunkResponse.data);
        return res.status(500).send('Error uploading chunk');
      }
    } else {
      console.error('Error uploading file:', initialResponse.data);
      return res.status(500).send('Error uploading file');
    }
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};
module.exports = {
  registerViaInvite,
  register,
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser,
  sendotp,
  submitotp,
  sendInvitation,
  upload,
  uploadOne,
  uploadForm,
  updateApplicationStatus,
  checkEmail,
  removeFile,
  updateApplication,
  getAllFiles,
updateDocumentStaus,
uploadFormMOre,
 deleteFileHandler,
 setCFormData,
 webhook,
 dataPosttoHubspot,
 generatePDF,
 createFolder,
 getById,
 uploadfordashboard,deleteUserById
//  uploadFileToHubSpot
};
