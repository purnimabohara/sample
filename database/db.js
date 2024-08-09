// importing any necessary packages
const mongoose = require('mongoose');

// function (Any)
const connectDB = () => {
    mongoose.connect(process.env.DB_URL).then(() =>{
    console.log("Connected to Database")
})
}

// export 
module.exports = connectDB;