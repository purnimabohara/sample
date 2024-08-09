const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberofGuests: {
    type: Number,
    required: true,
  },
  specialRequirements: {
    type: String,
    required: true,
  },
 
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  restaurantsName: {
    type: Schema.Types.ObjectId,
    ref: "restaurants",
  },
  categoriesName: [
    {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
  bookingStatus: {
    type: String,
    required: true,
    default: "Not Approved", 
    trim: true,
},
});



const Booking = mongoose.model("bookings", BookingSchema);

module.exports = Booking;
