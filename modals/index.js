const { Sequelize, DataTypes, Op } = require('sequelize');
  // Passing parameters separately (other dialects)
const sequelize = new Sequelize('myAppform', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    operationsAliases: false,
     pool: {
     max: 5,
     min: 0,
     acquire: 30000,
     idle: 1000 }
  });
  const  db={};
  db.Sequelize=Sequelize;
  db.sequelize=sequelize;
  try {
    db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  db.userModel = require('./userModel')(sequelize,DataTypes, Op);
  db.companyModel =  require('./companyModel')(sequelize,DataTypes,Op);
  db.sequelize.sync({alter:true})
  .then(() => {
    console.log('Table .... are syncronized');
  })
  .catch((err) => {
    console.error('Error creating table:', err);
  });     
    module.exports = db;