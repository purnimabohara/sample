const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
 
  productName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: Number,
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  productImageUrl:{
    type:String,
    required:true,
    trim:true,
},
requestedBy: {
  type: Schema.Types.ObjectId,
  ref: "users",
  required: true,
},
userName: {
  type:String,
  required:true,
  
  
},
requestStatus: {
  type: String,
  required: true,
  default: "Not Approved", 
  trim: true,
},
});

const Requests = mongoose.model('requests', requestSchema); // Corrected the schema reference here

module.exports = Requests;
