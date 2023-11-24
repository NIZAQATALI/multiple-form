const bcrypt = require("bcryptjs");
const userService = require("../Services/userServices");
const companyService = require('../Services/companyService.js');
const nodemailer = require('nodemailer');
const userModel = require("../modals/userModel");
const auth = require("../MiddleWares/auth");
const jwt = require("jsonwebtoken");
var db = require('../modals/index.js');
// var db = require('../Images');
// image Upload
const multer = require('multer')
const path = require('path')
var  User =  db.userModel;
const register = async (req, res) => {
  const { email } = req.body;
  // Check if the user with the provided email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser && (existingUser.applicationStatus == null||existingUser.applicationStatus==false)) {
    // User with the email already exists, update the user
    await userService.updateUser(existingUser.id, req.body);
    return res.status(200).send({ message: "User updated successfully!"});
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
const uploadForm = async (req, res) => {
  try {
const id=req.params.userId;
console.log("req.files.schedule_pdf_name[0].name",req.files.schedule_pdf_name[0])
    const updatedUser = await userService.uploadForm(id,{...req.body,schedule_pdf_name:req.files.schedule_pdf_name[0].originalname, 
      schedule_pdf:req.files.schedule_pdf_name[0].path,
      driving_licence_name:req.files.driving_licence[0].originalname ,
     driving_licence:req.files.driving_licence[0].path ,
      FormA1099:req.files.FormA1099_name[0].path,
      FormA1099_name:req.files.FormA1099_name[0].originalname,
      FormB1099:req.files.FormB1099_name[0].path,
      FormB1099_name:req.files.FormB1099_name[0].originalname,
      ks22020:req.files.ks22020[0].path,
      ks22020_name:req.files.ks22020[0].originalname,
      ks2020:req.files.ks2020[0].path,
      ks22020_name:req.files.ks2020[0].originalname,
      Tax_Return_2020:req.files.Tax_Return_2020[0].path,
      Tax_Return_2020_name:req.files.Tax_Return_2020[0].originalname,
      Tax_Return_2021:req.files.Tax_Return_2021[0].path,
      Tax_Return_2021_name:req.files.Tax_Return_2021[0].originalname,
      supplemental_attachment_2020:req.files.supplemental_attachment_2020[0].path,
      supplemental_attachment_2020_name:req.files.supplemental_attachment_2020[0].originalname,
      supplemental_attachment_2021:req.files.supplemental_attachment_2021[0].path,
      supplemental_attachment_2021_name:req.files.supplemental_attachment_2020[0].originalname,} );
// Now it should be defined
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
      return res.status(400).json({ message: 'Email is available.' });
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
);
        res.status(200).json({ code: 200, message: 'OTP sent' });
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
    const destinationPath = path.join(__dirname, '../Images');
    cb(null, 'Images');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
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
  { name: 'schedule_pdf_name', maxCount: 1 },
  { name: 'driving_licence', maxCount: 1 },
  { name: 'FormA1099_name', maxCount: 1 },
  { name: 'FormB1099_name', maxCount: 1 },
  { name: 'ks22020', maxCount: 1 },
  { name: 'ks2020', maxCount: 1 },
  { name: 'Tax_Return_2020', maxCount: 1 },
  { name: 'Tax_Return_2021', maxCount: 1 },
  { name: 'supplemental_attachment_2020', maxCount: 1 },
  { name: 'supplemental_attachment_2021', maxCount: 1 },
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
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: '5000000' },
//   fileFilter: (req, file, cb) => {
//       const fileTypes = /jpeg|jpg|png|gif|pdf/
//       const mimeType = fileTypes.test(file.mimetype)  
//       const extname = fileTypes.test(path.extname(file.originalname))
//       if(mimeType && extname) {
//           return cb(null, true)
//       }
     
//       cb('Give proper files formate to upload')
//   }
// }).single('schedule_pdf_name')
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
  uploadForm,
  updateApplicationStatus,
  checkEmail
};
