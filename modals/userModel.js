module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('appsetczones', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
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
    },
    first_name: {
      type: DataTypes.TEXT,
    },
    last_name: {
      type: DataTypes.TEXT,
    },
    business_name: {
      type: DataTypes.TEXT,
    },
    trade_name: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    company_name:{
      type: DataTypes.TEXT,
    },
    employees:{
      type: DataTypes.TEXT,
    },
    job_title: {
      type: DataTypes.TEXT,
    
    },
    address_line_1: {
      type: DataTypes.TEXT,
    
    },
    city: {
      type: DataTypes.TEXT,
    },
    state: {
      type: DataTypes.TEXT,
    },
    zip: {
      type: DataTypes.STRING,
    },
    your_file_schedule:{
      type: DataTypes.TEXT,
    },
    if_you_have_positive_earning:{ 
      type: DataTypes.TEXT,
    },
    did_you_miss_SEWDTC:{
      type: DataTypes.TEXT,
    },
    have_you_filed_already_for_setc:{
      type: DataTypes.TEXT,
    },
  
    otp: {
      type: DataTypes.TEXT,
    },
    otp_used: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.TEXT,
    },
    know_about_us:{
      type:DataTypes.TEXT
    },
    status:{
      type:DataTypes.TEXT
    },
    deleted_at:{
      type:DataTypes.TEXT
    },
    created_at:{
      type:DataTypes.TEXT
    },
    updated_at:{
      type:DataTypes.TEXT
    },
    pdf_file:{
      type:DataTypes.TEXT
    },
    file_name:{
      type:DataTypes.TEXT 
    },
    home_address:{
      type:DataTypes.TEXT
    },
    address_line_2:{
      type:DataTypes.TEXT
    },
     self_employed_from:{
      type:DataTypes.TEXT
    },
     net_income_2019: {
      type: DataTypes.TEXT,
      defaultValue: '0'
    },
    net_income_2020: {
      type: DataTypes.TEXT,
      defaultValue: '0'
    },
    net_income_2021: {
      type: DataTypes.TEXT,
      defaultValue: '0'
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
    accounting_professional:{
      type: DataTypes.TEXT,
    },
    accounting_partnership:{
      type: DataTypes.TEXT,
    },
    pre_signature_document_name:{
      type: DataTypes.TEXT,
    },
    pre_signature_document:{
      type: DataTypes.TEXT,
    },
    // personally_sick_symptoms_2020:{
    //   type: DataTypes.TEXT,
    // },
    // personally_sick_symptoms_2021:{
    //   type: DataTypes.TEXT,
    // },
    // covid_experienced_symptoms_2020:{
    //   type: DataTypes.TEXT,
    // },
    // covid_experienced_symptoms_2021:{
    //   type: DataTypes.TEXT,
    // },
    // childs_daycare_2020:{
    //   type: DataTypes.TEXT,
    // },
    // childs_daycare_2021:{
    //   type: DataTypes.TEXT,
    // },
    
    Family_Sick_Leave:{
      type: DataTypes.TEXT,
    },
    amount:{
      type:  DataTypes.DECIMAL(10,2),
    },
    driving_licence: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('driving_licence');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('driving_licence', JSON.stringify(value));
      },
    },
   
    driving_licence_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('driving_licence_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('driving_licence_name', JSON.stringify(value));
      },
    },
  schedule_pdf_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('schedule_pdf_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('schedule_pdf_name', JSON.stringify(value));
      },
    },
     schedule_pdf: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('schedule_pdf');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('schedule_pdf', JSON.stringify(value));
      },
    },
    FormA1099: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('FormA1099');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('FormA1099', JSON.stringify(value));
      },
    },
    FormA1099_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('FormA1099_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('FormA1099_name', JSON.stringify(value));
      },
    },
    FormB1099_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('FormB1099_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('FormB1099_name', JSON.stringify(value));
      },
    },
    FormB1099: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('FormB1099');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('FormB1099', JSON.stringify(value));
      },
    },
    ks22020_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('ks22020_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('ks22020_name', JSON.stringify(value));
      },
    },
    ks22020: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('ks22020');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('ks22020', JSON.stringify(value));
      },
    },
    ks2020_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('ks2020_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('ks2020_name', JSON.stringify(value));
      },
    },
    ks2020: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('ks2020');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('ks2020', JSON.stringify(value));
      },
    },
    Tax_Return_2020_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('Tax_Return_2020_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('Tax_Return_2020_name', JSON.stringify(value));
      },
    },
    Tax_Return_2020: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('Tax_Return_2020');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('Tax_Return_2020', JSON.stringify(value));
      },
    },
    Tax_Return_2021_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('Tax_Return_2021_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('Tax_Return_2021_name', JSON.stringify(value));
      },
    },
    Tax_Return_2021: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('Tax_Return_2021');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('Tax_Return_2021', JSON.stringify(value));
      },
    },
    supplemental_attachment_2020: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('supplemental_attachment_2020');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('supplemental_attachment_2020', JSON.stringify(value));
      },
    },
    supplemental_attachment_2020_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('supplemental_attachment_2020_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('supplemental_attachment_2020_name', JSON.stringify(value));
      },
    },

    supplemental_attachment_2021_name: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('supplemental_attachment_2021_name');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('supplemental_attachment_2021_name', JSON.stringify(value));
      },
    },
    supplemental_attachment_2021: {
      type: DataTypes.TEXT, // Use STRING instead of ARRAY
      defaultValue: '[]',    // Set default value as a string representation of an empty array
      get() {
        // Deserialize the JSON string when retrieving the value
        const rawValue = this.getDataValue('supplemental_attachment_2021');
        return JSON.parse(rawValue || '[]');
      },
      set(value) {
        // Serialize the array as a JSON string when setting the value
        this.setDataValue('supplemental_attachment_2021', JSON.stringify(value));
      },
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
    // supplemental_attachment_2020: {
    //   type: DataTypes.TEXT,
    // },
    // supplemental_attachment_name_2020: {
    //   type: DataTypes.TEXT,
    // },
   
    // supplemental_attachment_2021: {
    //   type: DataTypes.TEXT,
    // },
    // supplemental_attachment_name_2021: {
    //   type: DataTypes.TEXT,
    // },
   
    // supplemental_attachment_2020_name: {
    //   type: DataTypes.TEXT,
     
    // },
    // supplemental_attachment_2021_name: {
    //   type: DataTypes.TEXT,
     
    // },
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
      type:DataTypes.TEXT,
    },
      final_credit_amount:{
      type:DataTypes.TEXT,
    },
    final_roundedValue:{
      type:DataTypes.TEXT,
    },
    final_status:{
      type:DataTypes.TEXT,
    },
    mandatory_questions:{
      type:DataTypes.TEXT,
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
    is_docs_verify:{
      type:DataTypes.TEXT,
      defaultValue:"not verified"
      },
      isProcess:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
        },
        hubspot_record_id:{
          type:DataTypes.BOOLEAN,
          defaultValue:false
          },
          hubspotAmount:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
            },
    // companies: {
    //   type: DataTypes.STRING, // Use STRING instead of ARRAY
    //   defaultValue: '[]',    // Set default value as a string representation of an empty array
    //   get() {
    //     // Deserialize the JSON string when retrieving the value
    //     const rawValue = this.getDataValue('companies');
    //     return JSON.parse(rawValue || '[]');
    //   },
    //   set(value) {
    //     // Serialize the array as a JSON string when setting the value
    //     this.setDataValue('companies', JSON.stringify(value));
    //   },
    // },
  }
  );
  return User;
};
