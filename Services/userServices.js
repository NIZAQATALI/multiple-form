
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
    console.log("object registration service");
    const newUser = await User.create({ ...user, });
    console.log("New user created:", newUser);
newUser.record_id=newUser.id;
 await newUser.save();
    callback(null, { message: "User created successfully!", "NewRecord": newUser.record_id});
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const uniqueViolation = err.errors.find(error => error.type === 'unique violation');
      if (uniqueViolation) {
        return callback({
          errMessage: "Email already in use!",
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
};

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
  console.log("id...........",id)
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
//  try {
//             const user = await User.findByPk(userId);
//             if (!user) {
//               return res.status(404).json({ error: 'User not found' });
//             }
//             // Update the user's properties
//             user.name = name;
//             user.surame = surname;
//             console.log("nn",user.surname);
//             // Save the changes to the database
//             await user.save();
//             return res.status(200).json(user);
//           } catch (error) {
//             return res.status(500).json({ error: 'Error updating user' });
//           }
//         });
// const updateUser = async (id, updateData) => {
//   try {
//     console.log("updateUser function called with id:", id);
//     const user = await User.findByPk(id);
//     // const [numOfUpdatedRows, updatedUsers] = await userModel.update(updateData, {
//     //   where: { id },
//     //   returning: true,
//     // });

//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//                   }
//                   // Update the user's properties
//                   user.userType = updateData.userType;
//                   console.log("nn",user.userType);
//                   // Save the changes to the database
//                   await user.save();
//                   console.log("oooooooooooooooo",user)
//                   return (user);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
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
const uploadForm = async (id, updateData) => {
  try {
    console.log("updateUser function called with id:", id);
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
module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  getUserWithMail,
  updateUser ,
  submitOtp ,
  deleteUser,
  uploadForm
};
