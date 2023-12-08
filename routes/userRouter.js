const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();
 const auth = require("../MiddleWares/auth");
router.post("/create", userController.register);
router.post("/checkMail", userController.checkEmail);
router.post("/login", userController.login);
router.post("/send-invitation", userController.sendotp);
router.post("/verify", userController.submitotp);
router.get("/getUser",auth.verifyToken, userController.getUser);
router.put("/:stepNumber/updateuser", auth.verifyToken,  userController.updateUser);
router.put("/upload-form-data", userController.upload, auth.verifyToken,userController.uploadForm);
router.put("/multiple-form-data", userController.upload, auth.verifyToken,userController.uploadFormMOre);
router.delete("/remove-file",auth.verifyToken ,userController.removeFile);
router.put("/updateApplication",auth.verifyToken ,userController.updateApplication);
router.put("/updateDocumentStatus",auth.verifyToken ,userController.updateDocumentStaus);
router.get("/get-all-uploaded-files",auth.verifyToken ,userController.getAllFiles);
// Define a route for deleting a file
router.delete('/deleteFile',auth.verifyToken, userController.deleteFileHandler);

module.exports = router;