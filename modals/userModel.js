module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id:{
      type: DataTypes.INTEGER,
    },
    customer_id:{
      type: DataTypes.INTEGER,
    },
    step:{
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    business_name: {
      type: DataTypes.STRING,
    },
    trade_name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    company_name:{
      type: DataTypes.INTEGER,
    },
    employees:{
      type: DataTypes.STRING,
    },
    job_title: {
      type: DataTypes.TEXT,
    
    },
    address_line_1: {
      type: DataTypes.TEXT,
     
    },
    city: {
      type: DataTypes.STRING,
     
    },
    state: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
  
    otpUsed: {
      type: DataTypes.BOOLEAN,
    },
    country: {
      type: DataTypes.STRING,
     
    },
    know_about_us:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.STRING
    },
    deleted_at:{
      type:DataTypes.STRING
    },
    created_at:{
      type:DataTypes.STRING
    },
    updated_at:{
      type:DataTypes.STRING
    },
    pdf_file:{
      type:DataTypes.STRING
    },
    file_name:{
      type:DataTypes.STRING
    },
    home_address:{
      type:DataTypes.STRING
    },
    address_line_2:{
      type:DataTypes.STRING
    },
  self_employed_from:{
      type:DataTypes.STRING
    },
  
    net_income_2019: {
      type: DataTypes.DECIMAL(10, 2),
     
    },
    net_income_2020: {
      type: DataTypes.DECIMAL(10, 2),
     
    },
    net_income_2021: {
      type: DataTypes.DECIMAL(10, 2),
     
    },
    business_negatively_impacted: {
      type: DataTypes.TEXT,
     
    },

    personal_startdate2020: {
      type: DataTypes.TEXT,
     
    },
    personal_enddate2020: {
      type: DataTypes.TEXT,
     
    },
    personal_startdate2021: {
      type: DataTypes.TEXT,
     
    },
    personal_enddate2021: {
      type: DataTypes.TEXT,
     
    },
    cared_startdate2020: {
      type: DataTypes.TEXT,
     
    },
    cared_enddate2020: {
      type: DataTypes.TEXT,
     
    },
    cared_startdate2021: {
      type: DataTypes.TEXT,
     
    },
    cared_enddate2021: {
      type: DataTypes.TEXT,
     
    },
    minor_startdate2020: {
      type: DataTypes.TEXT,
     
    },
    minor_enddate2020: {
      type: DataTypes.TEXT,
     
    },
    minor_startdate2021: {
      type: DataTypes.TEXT,
    },
    minor_enddate2021: {
      type: DataTypes.TEXT,
    },
    employed_as_W2:{
      type: DataTypes.TEXT,

    },
    Family_Sick_Leave:{
      type: DataTypes.TEXT,
    },
    amount:{
      type:  DataTypes.DECIMAL,
    },
    driving_licence:{
      type:  DataTypes.TEXT,
    },
    driving_licence_name:{
      type:  DataTypes.TEXT,
    },
    schedule_pdf_name:{
      type: DataTypes.TEXT
    },
    schedule_pdf:{
      type: DataTypes.TEXT
    },
    
    personal_enddate2020_days:{
      type: DataTypes.TEXT
    },
    personal_enddate2021_days:{
      type: DataTypes.TEXT
    },
    sixdays: {
      type: DataTypes.TEXT,
     field: '6days'
    },
    fivedays: {
      type: DataTypes.TEXT,
      field: '5days'
     
    },
    fourdays: {
      type: DataTypes.TEXT,
      field: '4days'
     
    },
    threedays: {
      type: DataTypes.TEXT,
      field: '3days'
     
    },
    twodays: {
      type: DataTypes.TEXT,
      field: '2days'
     
    },
    onedays: {
      type: DataTypes.TEXT,
      field: '1days'
     
    },
    amount2020: {
      type: DataTypes.TEXT,
     
    },
    amount2021: {
      type: DataTypes.TEXT,
     
    },
    Tax_Return_2020: {
      type: DataTypes.TEXT,
    },
    Tax_Return_2020_name: {
      type: DataTypes.TEXT,
    },
    Tax_Return_2021: {
      type: DataTypes.TEXT,
    },
    Tax_Return_2021_name: {
      type: DataTypes.TEXT,
    },
    supplemental_attachment_2020: {
      type: DataTypes.TEXT,
    },
    supplemental_attachment_name_2020: {
      type: DataTypes.TEXT,
    },
   
    supplemental_attachment_2021: {
      type: DataTypes.TEXT,
    },
    supplemental_attachment_name_2021: {
      type: DataTypes.TEXT,
    },
   
    supplemental_attachment_2020_name: {
      type: DataTypes.TEXT,
     
    },
    supplemental_attachment_2021_name: {
      type: DataTypes.TEXT,
     
    },
    FormA1099_name: {
      type: DataTypes.TEXT,
     
    },
    FormB1099_name: {
      type: DataTypes.TEXT,
     
    },
    FormB1099: {
      type: DataTypes.TEXT,
    },
    FormA1099: {
      type: DataTypes.TEXT,
    },
    ks22020_name: {
      type: DataTypes.TEXT,
    },
    ks2020_name: {
      type: DataTypes.TEXT,
    },
    ks22020: {
      type: DataTypes.TEXT,
    },
    ks2020: {
      type: DataTypes.TEXT,
    }, 
    net_income_threshold_step_1: {
      type: DataTypes.TEXT,
    },
  
    greater_amount_2020_step_1: {
      type: DataTypes.TEXT,
    },
   
    greater_amount_2021_step_1: {
      type: DataTypes.TEXT,
    },
  
    remaining_net_income_2020_step_1: {
      type: DataTypes.TEXT,
    },
    remaining_net_income_2021_step_1: {
      type: DataTypes.TEXT,
    },
    credit_amount_2020_step_1:{
      type: DataTypes.TEXT,
    },
    credit_amount_2021_step_1:{
      type: DataTypes.TEXT,
    },
    credit_amount_remaining_2020_step_1: {
      type: DataTypes.TEXT,
    },
    credit_amount_remaining_2021_step_1: {
      type: DataTypes.TEXT,
    },
    adw_2020_step_1:{
      type: DataTypes.TEXT
    },
   
    adw_2021_step_1:{
      type: DataTypes.TEXT
    },
    max_credit_amount_threshold_step_1:{
      type: DataTypes.TEXT
    },
    leave_days_2020_step_1:{
      type: DataTypes.TEXT
    },
    leave_days_2021_step_1:{
      type: DataTypes.TEXT
    },
    net_income_threshold_step_2:{
      type: DataTypes.TEXT
    },
    greater_amount_2020_step_2:{
      type:DataTypes.TEXT
    },
    greater_amount_2021_step_2:{
      type:DataTypes.TEXT
    },
    remaining_net_income_2020_step_2:{
      type:DataTypes.TEXT
    },
    remaining_net_income_2021_step_2:{
      type:DataTypes.TEXT
    },
    credit_amount_2020_step_2:{
      type:DataTypes.TEXT
    },
    credit_amount_2021_step_2:{
      type:DataTypes.TEXT
    },
    adw_2020_step_2:{
      type:DataTypes.TEXT
    },
    adw_2021_step_2:{
      type:DataTypes.TEXT
    },
    applied_leave_days_2020_step_2:{
      type:DataTypes.TEXT
    },
    applied_leave_days_2021_step_2:{
      type:DataTypes.TEXT
    },
    leave_days_2020_step_2:{
      type:DataTypes.TEXT
    },
    leave_days_2021_step_2:{
      type:DataTypes.TEXT
    },
    step_2_leave_calculate_2020:{
      type:DataTypes.TEXT
    },
    step_2_leave_calculate_2021:{
      type:DataTypes.TEXT
    },
    max_credit_amount_threshold_step_2:{
      type:DataTypes.TEXT
    },
    credit_amount_2020_step_1_and_step_2:{
      type:DataTypes.TEXT
    },
    credit_amount_2021_step_1_and_step_2:{
      type:DataTypes.TEXT
    },
    credit_amount_step_1_and_step_2:{
      type:DataTypes.TEXT
    },
    net_income_threshold_step_3:{
      type:DataTypes.TEXT
    },
    greater_amount_2020_step_3:{
      type:DataTypes.TEXT
    },
    greater_amount_2021_step_3:{
      type:DataTypes.TEXT
    },
    remaining_net_income_2020_step_3:{
      type:DataTypes.TEXT
    },
    remaining_net_income_2021_step_3:{
      type:DataTypes.TEXT
    },
    credit_amount_2020_step_3:{
      type:DataTypes.TEXT
    },
    credit_amount_2021_step_3:{
      type:DataTypes.TEXT
    },
    adw_2020_step_3:{
      type:DataTypes.TEXT
    },
    adw_2021_step_3:{
      type:DataTypes.TEXT
    },
    leave_days_2020_step_3:{
      type:DataTypes.TEXT
    },
    leave_days_2021_step_3:{
      type:DataTypes.TEXT
    },
    step_3_leave_calculate_2020:{
      type:DataTypes.TEXT
    },
    step_3_leave_calculate_2021:{
      type:DataTypes.TEXT
    },
    max_credit_amount_threshold_step_3:{
      type:DataTypes.TEXT
    },
    total_credit_amount_step_3:{
      type:DataTypes.TEXT
    },
    final_credit_amount:{
      type:DataTypes.TEXT
    },
    website_id:{
      type:DataTypes.STRING
    },
    process_1:{
      type:DataTypes.TEXT
    },
    process_2:{
      type:DataTypes.TEXT
    },
process_3:{
  type:DataTypes.TEXT
},
process_4:{
  type:DataTypes.TEXT
},
process_5:{
  type:DataTypes.TEXT
},
process_6:{
  type:DataTypes.TEXT
},
process_7:{
  type:DataTypes.TEXT
},
process_2_email_status:{
  type:DataTypes.BOOLEAN
},
process_2_file_reminder:{
  type:DataTypes.BOOLEAN
},
    documentStatus:{
    type:DataTypes.BOOLEAN,
    default:false
    },
    applicationStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    applicationWithDocument: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
