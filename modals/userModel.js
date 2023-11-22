module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    self_employed_from: {
      type: DataTypes.STRING,
    },
    record_id: {
      type: DataTypes.STRING,
    },
    step: {
      type: DataTypes.INTEGER,
    
    },
    first_name: {
      type: DataTypes.STRING,
      
    },
    last_name: {
      type: DataTypes.STRING,
     
    },
    phone: {
      type: DataTypes.STRING,
     
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    business_name: {
      type: DataTypes.STRING,
     
    },
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
   
    avatar: {
      type: DataTypes.STRING,
    },
   
   
    otp: {
      type: DataTypes.STRING,
    },
    invitationToken: {
      type: DataTypes.STRING,
    },
    otpUsed: {
      type: DataTypes.BOOLEAN,
    },
    applicationStatus: {
      type: DataTypes.BOOLEAN,
      default: false,
    
    },
    companies: {
      type: DataTypes.STRING, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('companies');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('companies', JSON.stringify(value));
      },
    },
  });

  return User;
};
