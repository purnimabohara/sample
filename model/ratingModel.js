

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ratingSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    itemID: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});

const Rating = mongoose.model('rating', ratingSchema);
module.exports = Rating;