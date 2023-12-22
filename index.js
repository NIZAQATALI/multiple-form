const auth = require('./MiddleWares/auth.js');
const dotenv=require('dotenv')
const cors = require('cors');
const express = require('express');
const unless = require('express-unless');
const {Sequelize} = require('sequelize');
const bodyParser = require("body-parser");
const session = require("express-session");
//  Passing parameters separately (other dialects)
const app = express()
app.use(cors()); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(
  session({
    secret: "dfsf94835asda",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json({ limit: '150mb' }));
 dotenv.config({path:'./config.env'});
 app.use(cors());
 app.use("/Images", express.static("Images"));
 //routes
 const userRoute = require("./routes/userRouter.js");
 const companyRoute = require("./routes/companyRoute.js");
//  const stripeRoutes= require("./routes/stripeRoutes.js");
// const workspaceRoute= require("./routes/workspaceRoute.js");
// middleware
app.use('/user', userRoute);
app.use('/company', companyRoute);
// app.use('/stripe', stripeRoutes);
//app.use('/workspace', workspaceRoute);
//  app.post('/register', async function (req, res) {
//   const { name, surname, email, password } = req.body;
//   if (!(name && surname && email && password))
//     return res
//       .status("400")
//       .send({ errMessage: "Please fill all required areas!" });
//    const  newUser = await User.create({name, surname, email, password })
//     res.send(newUser);
//      })
//      app.get('/getAll', async function (req, res) {
//       const  newUser = await User.findAll()
//        res.send(newUser);
//        console.log(newUser);
//         })
//         app.put('/updateUser/:id', async function (req, res) {
//           const { name, surname } = req.body;
//           const userId = req.params.id;
//           try {
//             const user = await User.findByPk(userId);
//             if (!user) {
//               return res.status(404).json({ error: 'User not found' });
//             }
//             // Update the user's properties
//             user.name = name;
//             user.surame = surname;
//             console.log("nn",user.surname);
//             // Save the changes to the database
//             await user.save();
//             return res.status(200).json(user);
//           } catch (error) {
//             return res.status(500).json({ error: 'Error updating user' });
//           }
//         });
//         app.delete('/deleteUser/:id', async function (req, res) {
//           const userId = req.params.id;
//           try {
//             const user = await User.findByPk(userId);
//             if (!user) {
//               return res.status(404).json({ error: 'User not found' });
//             }
//             // Delete the user from the database
//             await user.destroy();
        
//             return res.status(200).json({ error: 'User  Deleted  successfully' });; // Respond with a 204 status code for successful deletion
//           } catch (error) {
//             return res.status(500).json({ error: 'Error deleting user' });
//           }
//         });
  app.listen(process.env.PORT,()=>{
    console.log(" Server is running on port 5000");
});


