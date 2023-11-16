const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
 const auth = require("../MiddleWares/auth");
router.post("/create", auth.verifyToken, userController.register);
router.post("/login", userController.login);
router.put("/:stepNumber/:userId",userController.updateUser);


module.exports = router;