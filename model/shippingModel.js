const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shippingInfoSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    pickUpDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    specificRequirements: {
        required: true,
        type: String,
    },
    policyAgreement1: {
        type: Boolean,
        required: true,
    },
    policyAgreement2: {
        type: Boolean,
        required: true,
    },
});


const ShippingInfo = mongoose.model('ShippingInfo', shippingInfoSchema); // Corrected the schema reference here

module.exports = ShippingInfo;
