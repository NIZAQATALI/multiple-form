const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
 const auth = require("../MiddleWares/auth");
router.post("/create", userController.register);
router.post("/login", userController.login);
router.post("/send-invitation", userController.sendotp);
router.post("/verify", userController.submitotp);
router.get("/getUser",auth.verifyToken, userController.getUser);
router.put("/:stepNumber/updateuser", auth.verifyToken,  userController.updateUser);
router.put("/:userId", userController.upload,userController.uploadForm);


module.exports = router;