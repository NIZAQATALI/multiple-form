const express = require('express');
const companyController = require('../Controllers/companyController');
const router = express.Router();
const auth = require("../MiddleWares/auth");
router.post('/create', companyController.create);
router.get("/get-companies", auth.verifyToken,companyController.getCompanies);
router.get("/get-workspace/:companyId/", auth.verifyToken, companyController.getCompany);
router.put("/update-company/:companyId", auth.verifyToken, companyController.updateCompany);
module.exports = router;
  