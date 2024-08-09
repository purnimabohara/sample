const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema= new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    itemID: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
   
    totalPrice: {
        type: Number,
        required: true,
        default: 0,

    },
    cartQuantity: {
        type: Number,
        required: true,
        default: 1,
    },

});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;