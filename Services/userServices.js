
const { createRandomHexColor } = require("./helperMethods");
var db = require('../modals/index.js');
var  User =  db.userModel;
// const register = async (user, callback) => {
//   const newUser = userModel({ ...user, color:createRandomHexColor()});
//   await newUser
//     .save()
//     .then((result) => {
//       return callback(false, { message: "User created successfuly!" });
//     })
//     .catch((err) => {
//       return callback({ errMessage: "Email already in use!", details: err });
//     });
// };
const register = async (user, callback) => {
  try {
    const newUser = await User.create({ ...user, });
newUser.record_id=newUser.id;
 await newUser.save();
    callback(null, { message: "User created successfully!", "NewRecord": newUser.record_id});
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
console.log(userId,"klkkkklklklklklklklklklklklkl");
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
    // Dynamically update user properties based on updateData
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        user[key] = updateData[key];
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
  console.log("mmmmmmmmmmmmmmmmmmmmmm")
  try {
    console.log("uuuuuuuuuuu");
    const user = await User.findByPk(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    // Update the application status
    user.applicationStatus = true;
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
 updateDocumentStatus
};
