// importing
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const cors=require('cors');
const multiparty=require('connect-multiparty');
const cloudinary= require('cloudinary');


// Making express app
const app = express();

// dotenv config
dotenv.config();

//cors policy
const corsPolicy={
    origin:true,
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsPolicy))

//multiparty middleware
app.use(multiparty())

//cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

// mongodb connection
connectDB();

// Accepting json data
app.use(express.json());

//test route
app.get('/test',(req,res)=> {
    res.send('Hello')
})

// user routes
app.use('/api/user', require('./routes/userRoutes'))
// our actual routes
// http://localhost:5000/api/user/create
// http://localhost:5000/api/user/login



app.use('/api/user', require('./routes/userRoutes'))
 
app.use('/api/admin', require('./routes/adminRoute'))


// defining port
const PORT = process.env.PORT;
// run the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
//exporting
module.exports=app;