const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
 const auth = require("../MiddleWares/auth");
router.post("/create", userController.register);
router.post("/login", userController.login);
router.put("/:stepNumber/:userId",   userController.updateUser);
router.put("/:userId", userController.upload,userController.uploadForm);


module.exports = router;