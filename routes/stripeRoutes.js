const express = require("express");
const userController = require("../Controllers/stripeController");
const router = express.Router();
 const auth = require("../MiddleWares/auth");

router.post("/sessions", userController.sessionStripe);
