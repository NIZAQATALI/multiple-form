
//const User = require('./userModel');
// const Board = require('./boardModel'); // Assuming you have a 'Board' model
module.exports = ( sequelize, DataTypes)=>{
const Company = sequelize.define('Company', {

  trade_name: {
    type: DataTypes.STRING,
   
  },
  address_line_1: {
    type: DataTypes.STRING,
   
  },
  city: {
    type: DataTypes.STRING,
   
  },
  state: {
    type: DataTypes.STRING,
   
  },
  address_line_2: {
    type: DataTypes.STRING,
   
  },
  zip: {
    type: DataTypes.STRING,
   
  },
  net_income_2019: {
    type: DataTypes.STRING,
   
  },
  net_income_2020: {
    type: DataTypes.STRING,
   
  },
  net_income_2021: {
    type: DataTypes.STRING,
   
  },
  personal_startdate2020: {
    type: DataTypes.STRING,
   
  },
  personal_enddate2020: {
    type: DataTypes.STRING,
   
  },
  personal_startdate2021: {
    type: DataTypes.STRING,
   
  },
  personal_enddate2021: {
    type: DataTypes.STRING,
   
  },
  sixdays: {
    type: DataTypes.STRING,
   
  },
  fivedays: {
    type: DataTypes.STRING,
   
  },
  fourdays: {
    type: DataTypes.STRING,
   
  },
  threedays: {
    type: DataTypes.STRING,
   
  },
  twodays: {
    type: DataTypes.STRING,
   
  },
  onedays: {
    type: DataTypes.STRING,
   
  },
  amount2021: {
    type: DataTypes.STRING,
   
  },
  amount2020: {
    type: DataTypes.STRING,
   
  },
  cared_startdate2020: {
    type: DataTypes.STRING,
   
  },
  cared_enddate2020: {
    type: DataTypes.STRING,
   
  },
  cared_startdate2021: {
    type: DataTypes.STRING,
   
  },
  cared_enddate2021: {
    type: DataTypes.STRING,
   
  },
  minor_startdate2020: {
    type: DataTypes.STRING,
   
  },
  minor_enddate2020: {
    type: DataTypes.STRING,
   
  },
  minor_startdate2021: {
    type: DataTypes.STRING,
   
  },
  minor_enddate2021: {
    type: DataTypes.STRING,
   
  },
  ks22020_name: {
    type: DataTypes.STRING,
   
  },
  ks2020_name: {
    type: DataTypes.STRING,
   
  },
  supplemental_attachment_2020_name: {
    type: DataTypes.STRING,
   
  },
  supplemental_attachment_2021_name: {
    type: DataTypes.STRING,
   
  },
  FormA1099_name: {
    type: DataTypes.STRING,
   
  },
  FormB1099_name: {
    type: DataTypes.STRING,
   
  },
  ks22020: {
    type: DataTypes.STRING,
   
  },
  ks2020: {
    type: DataTypes.STRING,
   
  },
  FormB1099: {
    type: DataTypes.STRING,
   
  },
  
  FormA1099: {
    type: DataTypes.STRING,
  },
 
  Tax_Return_2020: {
    type: DataTypes.STRING,
  },
 
  Tax_Return_2021: {
    type: DataTypes.STRING,
  },
 
  driving_licence: {
    type: DataTypes.STRING,
  },
 
  schedule_pdf: {
    type: DataTypes.STRING,
  },
 
  supplemental_attachment_2020: {
    type: DataTypes.STRING,
  },
 
  supplemental_attachment_2021: {
    type: DataTypes.STRING,
  },
 
  driving_licence_name: {
    type: DataTypes.STRING,
  },
 
  schedule_pdf_name: {
    type: DataTypes.STRING,
  },
  Tax_Return_2020_name: {
    type: DataTypes.STRING,
  },
  Tax_Return_2021_name: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
 
  owner: {
    type: DataTypes.STRING,
  },
  
  
});

console.log(Company === sequelize.models.Company); // true
return Company;
}