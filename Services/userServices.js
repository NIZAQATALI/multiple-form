
const { createRandomHexColor } = require("./helperMethods");
var db = require('../modals/index.js');
var  User =  db.userModel;
const axios = require("axios");







const register = async (user, callback) => {
  try {
    const newUser = await User.create({ ...user, });
newUser.record_id=newUser.id;
const step = user.step;


 await newUser.save();
    callback(null, { message: "User created successfully!", "NewRecord": newUser.record_id});
    console.log("uuwaqasssssssssssssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user.step)      // Call sendEmail function with user data

  //   if (user.step === '0') {
  //     console.log("uuwaqasssssssssssssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user.step)      // Call sendEmail function with user data

  //  await  sendEmail();
  //   }
 
  // if (user.step === '0') {
  //   console.log("uuwaqasssssssssssssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user.step);
  
  //   try {
  //     // Make an HTTP POST request to http://localhost:5000/user/sendEmail
  //     await axios.post('http://localhost:5000/user/sendEmail', {
  //       // Include any data you want to send in the request body
  //       // For example, you might want to send user data
        
  //     });
  
  //     console.log('HTTP POST request to http://localhost:5000/user/sendEmail successful');
  //   } catch (error) {
  //     console.error('Error making HTTP POST request:', error.message);
  //   }
  // }
  if (user.step === '0') {
    console.log("uuwaqasssssssssssssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user);
  
    try {
      // Make an HTTP POST request to http://localhost:5000/user/sendEmail
      const response = await axios.post('http://localhost:5000/user/sendEmail',{
        // Include any data you want to send in the request body
        // For example, you might want to send user data
        user
      });
      // Check if the response indicates success (adjust the condition based on your API response)
      if (response.status === 200) {
        console.log('HTTP POST request to http://localhost:5000/user/sendEmail successful');
        // Do something with the response data if needed
        // For example, you can access it using response.data
      } else {
        // Handle unexpected response status
        console.error('Unexpected HTTP response status:', response.status);
      }
    } catch (error) {
      // Handle network errors, request timeouts, or any other errors
      console.error('Error making HTTP POST request:', error.message);
    }
  }

  if (user.step === '0') {
    console.log("uuwaqasssssssssssssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", user);
  
    try {
      // Make an HTTP POST request to http://localhost:5000/user/sendEmail
      const response = await axios.post('http://localhost:5000/user/senduserEmail',{
        // Include any data you want to send in the request body
        // For example, you might want to send user data
        user
      });
      // Check if the response indicates success (adjust the condition based on your API response)
      if (response.status === 200) {
        console.log('HTTP POST request to http://localhost:5000/user/sendEmail successful');
        // Do something with the response data if needed
        // For example, you can access it using response.data
      } else {
        // Handle unexpected response status
        console.error('Unexpected HTTP response status:', response.status);
      }
    } catch (error) {
      // Handle network errors, request timeouts, or any other errors
      console.error('Error making HTTP POST request:', error.message);
    }
  }

  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const uniqueViolation = err.errors.find(error => error.type === 'unique violation');
      if (uniqueViolation) {
        return callback({
          errMessage: "Email already in use!  && 1 if  you  have  already  submitted  your  application  then  ypu  can  not  be  edit  this  after  submission  otherwise  use   another email  to  Register!   ",
          details: uniqueViolation,
        });
      } else {
        return callback({
          errMessage: "Something went wrong",
          details: err.message,
        });
      }
    }
  }
}
const login = async (email, callback) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return callback({ errMessage: "Your email is wrong!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getUser = async (id, callback) => {
  try {
    let user = await User.findByPk(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getById = async (id, callback) => {
  try {
    let user = await User.findByPk(id);
    if (!user) return callback({ errMessage: "User not found!" });
    return callback(false, { ...user.toJSON() });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getAllUser = async ( callback) => {
  try {
    console.log("Get All users")
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude password field
    });
    console.log("we  have :",users.length,"users")
    if (!users) return callback({ errMessage: "Users not found!" });
    return callback(false, users);
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getAllFiles = async (userId, callback) => {
  try {
    const userId = userId; // Assuming you have authentication middleware setting req.user
console.log(userId,"klkkkkl");
    // Fetch user data including uploaded files
    const user = await userService.getUserWithFiles(userId);

    // Extract and send the list of uploaded files
    const uploadedFiles = {
      schedule_pdf: user.schedule_pdf_name,
      driving_licence: user.driving_licence_name,
      FormA1099: user.FormA1099_name,
      FormB1099: user.FormB1099_name,
      ks22020: user.ks22020_name,
      ks2020: user.ks2020_name,
      Tax_Return_2020: user.Tax_Return_2020_name,
      Tax_Return_2021: user.Tax_Return_2021_name,
      supplemental_attachment_2020: user.supplemental_attachment_2020_name,
      supplemental_attachment_2021: user.supplemental_attachment_2021_name,
    };
    res.status(200).json(uploadedFiles);
  } catch (error) {
    console.error("Error getting uploaded files:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getUserWithMail = async (email, callback) => {
  try {
    let user = await User.findOne({ where: { email } });
    if (!user)
      return callback({
        errMessage: "There is no registered user with this e-mail.",
      });
    return callback(false, { ...user.toJSON() });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
}; 
const updateUser = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    console.log(updateData);
    const user = await User.findByPk(id);
    console.log(user.step,"user stepppp");
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Dynamically update user properties based on updateData
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        user[key] = updateData[key];
      }
    }
    // Save the changes to the database
    await user.save();
   
        // Check if the 'step' property is being updated and its value is 0
    if (user.step == 1) {
      console.log("stepppppppppppppppppppppp")
      try {
        // Make an HTTP POST request to http://localhost:5000/user/sendEmail
        const response = await axios.post('http://localhost:5000/user/sendemailonfirststep',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to http://localhost:5000/user/sendEmail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    }
    if (user.step==19) {
      try {
        // Make an HTTP POST request to http://localhost:5000/user/sendEmail
        const response = await axios.post('http://localhost:5000/user/sendemailOnNinteenstep',{
          // Include any data you want to send in the request body
          // For example, you might want to send user data
          user
        });
        // Check if the response indicates success (adjust the condition based on your API response)
        if (response.status === 200) {
          console.log('HTTP POST request to http://localhost:5000/user/sendEmail successful');
          // Do something with the response data if needed
          // For example, you can access it using response.data
        } else {
          // Handle unexpected response status
          console.error('Unexpected HTTP response status:', response.status);
        }
      } catch (error) {
        // Handle network errors, request timeouts, or any other errors
        console.error('Error making HTTP POST request:', error.message);
      }
    

    }
    return { status: 200, user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    return {status:500 ,error};
  }
};
// const uploadForm = async (id, updateData) => {
//   try {
//     console.log("updateUser function called with id:", id);
//     const user = await User.findByPk(id);
//     // if (!user) {
//     //   return res.status(404).json({ error: 'User not found' });
//     // }
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     // Dynamically update user properties based on updateData
//     for (const key in updateData) {
//       if (updateData.hasOwnProperty(key)) {
//         user[key] = updateData[key];
//       }
//     }
// user.applicationStatus = true;
//     // Save the changes to the database
//     await user.save();
//     return { status: 200, user:user.toJSON() };
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return {status:500 ,error};
//   }
// };
const uploadForm = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    const user = await User.findByPk(id);
    if (!user) {
      return { error: 'User not found' };
    }
    // // Dynamically update user properties based on updateData
    // for (const key in updateData) {
    //   if (updateData.hasOwnProperty(key)) {
    //     user[key] = updateData[key];
    //   }
    // }
      // Dynamically update user properties based on updateData
      // for (const key in updateData) {
      //   if (updateData.hasOwnProperty(key)) {
      //     // Check if the field is an array and already exists
      //     if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
      //       // If yes, append new values to the existing array
      //       user[key] = user[key].concat(updateData[key]);
      //     } else {
      //       // Otherwise, update the field with the new value
      //       user[key] = updateData[key];
      //     }
      //   }
      // }
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          // Check if the field is an array and already exists
          if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
            // Append a digit to the new file names to make them unique
            const uniqueNames = updateData[key].map((newName) => {
              let index = 1;
              let tempName = newName;
              // Iterate until a unique name is found
              while (user[key].includes(tempName)) {
                index += 1;
                const nameParts = newName.split('.');
                // Insert the index before the file extension
                tempName = `${nameParts[0]}_${index}.${nameParts[1]}`;
              }
              return tempName;
            });
            // If yes, append new values to the existing array
            user[key] = user[key].concat(uniqueNames);
          } else {
            // Otherwise, update the field with the new value
            user[key] = updateData[key];
          }
        }
      }
  
    // Save the changes to the database
    await user.save();
    return { status: 200, message: "Application  Submiited  succesfully", user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle specific error cases
    if (error.message === 'User not found') {
      return { status: 404, error: 'User not found' };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};
// const uploadForm = async (id, updateData) => {
//   try {
//     console.log("uploadForm function called with id:", id);
//     const user = await User.findByPk(id);
//     if (!user) {
//       return { error: 'User not found' };
//     }
//     // Define the list of required file fields
//     const requiredFiles = [
//       'schedule_pdf_name',
//       'driving_licence',
//       'FormA1099_name',
//       'FormB1099_name',
//       'ks22020',
//       'ks2020',
//       'Tax_Return_2020',
//       'Tax_Return_2021',
//       'supplemental_attachment_2020',
//       'supplemental_attachment_2021',
//     ];
//     // Update user properties based on updateData
//     for (const key in updateData) {
//       if (updateData.hasOwnProperty(key)) {
//         user[key] = updateData[key];
//       }
//     }

//     // Increment the count of uploaded documents
//     user.uploadedDocuments = (user.uploadedDocuments || 0) + 1;

//     // Check if all required documents are uploaded
//     if (user.uploadedDocuments === requiredFiles.length) {
//       user.documentStatus = 'Completed Document';
//     } else {
//       user.documentStatus = 'Documents Required';
//     }
//     // Save the updated user
//     await user.save();
//     return user;
//   } catch (err) {
//     console.error(err);
//     return { error: 'Internal Server Error' };
//   }
// };
const submitOtp = async (otp, newPassword) => {
  try {
    const result = await User.findOne({ otp: otp });
    if (!result) {
      throw { code: 404, message: 'OTP not found' };
    }
    if (result.otpUsed) {
      throw { code: 400, message: 'OTP already used' };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Mark the OTP as used and update the password
    await User.updateOne(
      { email: result.email, otpUsed: false }, // Only update if otpUsed is false
      { otpUsed: true, password: hashedPassword }
    );
    return { code: 200, message: 'Password updated' };
  } catch (err) {
    throw { code: 500, message: 'Server error' };
  }
};
const deleteUser = async (userId, callback) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return callback({
        errMessage: 'User not found',
      });
    }
    await user.destroy();
    return callback(null, { message: 'User deleted successfully' });
  } catch (err) {
    return callback({
      errMessage: 'Error deleting user',
      details: err.message,
    });
  }
};
// Inside userService.js
const updateApplication = async (userId) => {

  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    user.applicationStatus=true;
    // Save the updated user
    await user.save();
    return {user: user};
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const verfication = async (userId) => {

  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    user.is_docs_verify="verified";
    // Save the updated user
    await user.save();
    return {user: user};
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const updateDocumentStatus = async (userId) => {
  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    // Update the application status
    user.applicationWithDocument = true;
    // Save the updated user
    await user.save();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Internal Server Error' };
  }
};
const updateCalculator = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
    const user = await User.findByPk(id);
    if (!user) {
      return { error: 'User not found' };
    }
    // // Dynamically update user properties based on updateData
    // for (const key in updateData) {
    //   if (updateData.hasOwnProperty(key)) {
    //     user[key] = updateData[key];
    //   }
    // }
      // Dynamically update user properties based on updateData
      // for (const key in updateData) {
      //   if (updateData.hasOwnProperty(key)) {
      //     // Check if the field is an array and already exists
      //     if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
      //       // If yes, append new values to the existing array
      //       user[key] = user[key].concat(updateData[key]);
      //     } else {
      //       // Otherwise, update the field with the new value
      //       user[key] = updateData[key];
      //     }
      //   }
      // }
      for (const key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          // Check if the field is an array and already exists
          if (Array.isArray(user[key]) && Array.isArray(updateData[key]) && user[key].length > 0) {
            // Append a digit to the new file names to make them unique
            const uniqueNames = updateData[key].map((newName) => {
              let index = 1;
              let tempName = newName;
              // Iterate until a unique name is found
              while (user[key].includes(tempName)) {
                index += 1;
                const nameParts = newName.split('.');
                // Insert the index before the file extension
                tempName = `${nameParts[0]}_${index}.${nameParts[1]}`;
              }
              return tempName;
            });
            // If yes, append new values to the existing array
            user[key] = user[key].concat(uniqueNames);
          } else {
            // Otherwise, update the field with the new value
            user[key] = updateData[key];
          }
        }
      }
  
    // Save the changes to the database
    await user.save();
    return { status: 200, message: "Application  Submiited  succesfully", user: user.toJSON() };
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle specific error cases
    if (error.message === 'User not found') {
      return { status: 404, error: 'User not found' };
    }
    return { status: 500, error: 'Internal Server Error' };
  }
};

const sendEmail = async (req, res) => {
  console.log("rizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwaaaaaaaaaaaaaaaaan")      // Call sendEmail function with user data

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
      to: 'hafiznizaqatali@gmail.com', // list of receivers
      text: 'uogiiiiiiiisssssssssssss',
  })
  if (info.messageId) {
      console.log(info, 84)
      if (info.messageId) {
        console.log(info, 84);
   res.status(200).json({ code: 200, message: 'Email  has  been  sent  successfully'});
      } else {
        res.status(500).json({ code: 500, message: 'Server error' });
      }
    } 
}

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser ,
  submitOtp ,
  deleteUser,
  uploadForm,
 updateApplication,
 getAllFiles,
 updateDocumentStatus,
 updateCalculator,
 getById,
 verfication
};
