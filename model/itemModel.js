const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemImage: {
    type: String,
    required: true,
  },
  itemSecurityDeposit: {
    type: Number,
    required: true,
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
  itemPrice: {
    type: Number,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
 quantity: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  categoryName: { type: String, required: true },
  
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
