// controllers/restaurantRequestController.js

const Booking = require("../model/bookingModel");
const Restaurants = require("../model/categoryModel");
const Users = require("../model/userModel");

const getBookingsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const allBookings = await Booking.find({ bookedBy: userId });
    // Populate restaurant and category details
    await Booking.populate(allBookings, {
      path: "restaurantsName",
      select: "restaurantName",
    });
    await Booking.populate(allBookings, {
      path: "categoriesName",
      select: "categoryName",
    });
    res.json({
      success: true,
      message: "All bookings by the user is fetched successfully.",
      bookings: allBookings,
    });
    console.log(allBookings);
    // Check if the user exists
  } catch (error) {
    console.error("Error fetching bookings details.");
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { bookingStatus } = req.body;

    console.log(bookingId);
    console.log(bookingStatus);

    // Check if the bluebook with the given ID exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Update the bluebook status
    booking.bookingStatus = bookingStatus;
    await booking.save();

    return res.json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const submitBooking = async (req, res) => {
//   const userId = req.user.userId;
//   console.log(userId); // Assuming you have user authentication and user ID is available in req.user

//   // Check incoming data
//   console.log("SUBMIT BOOKING::}" + req.user.userId);
//   console.log(req.body);

//   // Destructure request body
//   const {
//     startDate,
//     endDate,
//     eventType,
//     phoneNumber,
//     address,
//     numberofGuests,
//     specialRequirements,
//     restaurantsName,
//     categoriesName,
//   } = req.body;

//   // Validate data
//   if (
//     !startDate ||
//     !endDate ||
//     !eventType ||
//     !phoneNumber ||
//     !address ||
//     !numberofGuests ||
//     !specialRequirements ||
//     !categoriesName
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "Please fill all the fields.",
//     });
//   }

//   try {
//     // Create new booking
//     const newBooking = new Booking({
//       startDate: startDate,
//       endDate: endDate,
//       eventType: eventType,
//       phoneNumber: phoneNumber,
//       address: address,
//       numberofGuests: numberofGuests,
//       specialRequirements: specialRequirements,
//       restaurantsName: restaurantsName,
//       categoriesName: categoriesName,
//       bookedBy: userId,
//     });

//     // Save the booking
//     await newBooking.save();
//     const user = await Users.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // user.booking.push(newBooking._id); // Add booking ID to user's booking array
//     // await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Restaurant booked successfully",
//       data: newBooking,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

//this is current
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("restaurantsName", "restaurantName")
      .populate("categoriesName", "categoryName");
    res.json({
      success: true,
      message: "Bookings fetched successfully",
      bookings: bookings,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSingleBooking = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required!" });
    }
    const booking = await Booking.findById(bookId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({
      success: true,
      message: "Booking fetched successfully",
      booking,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteBooking = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!bookId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required!" });
    }
    const deletedBooking = await Booking.findByIdAndDelete(bookId);
    if (!deletedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const submitBooking = async (req, res) => {
  const userId = req.user.userId;
  console.log(userId); // Assuming you have user authentication and user ID is available in req.user

  // Check incoming data
  console.log("SUBMIT BOOKING::}" + req.user.userId);
  console.log(req.body);

  // Destructure request body
  const {
    startDate,
    endDate,
    eventType,
    phoneNumber,
    address,
    numberofGuests,
    specialRequirements,
    restaurantsName,
    categoriesName,
  } = req.body;

  // Validate data
  if (
    !startDate ||
    !endDate ||
    !eventType ||
    !phoneNumber ||
    !address ||
    !numberofGuests ||
    !specialRequirements ||
    !restaurantsName ||
    !categoriesName
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  try {
    // Find the restaurant based on the name
    const restaurant = await Restaurants.findOne({
      _id: req.body.restaurantsName,
    });
    console.log("restaurant-id", restaurantsName);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Create new booking
    const newBooking = new Booking({
      startDate: startDate,
      endDate: endDate,
      eventType: eventType,
      phoneNumber: phoneNumber,
      address: address,
      numberofGuests: numberofGuests,
      specialRequirements: specialRequirements,
      restaurantsName: restaurant._id,
      categoriesName: categoriesName, // Save the restaurant's ID instead of name

      bookedBy: userId,
    });

    // Save the booking
    await newBooking.save();

    // Fetch user (optional)
    await Users.findByIdAndUpdate(userId, {
      $push: { booking: newBooking._id },
    });

    res.status(200).json({
      success: true,
      message: "Restaurant booked successfully",
      data: newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// for fetching bookings by restaurant

const getBookingsByRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const bookings = await Booking.find({ restaurantsName: restaurantId })
      .populate("restaurantsName") // Populate the restaurant details
      .exec();

    res.status(200).json({
      success: true,
      message: "List of bookings by restaurant",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// for fetching bookings by Category

const getBookingsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const bookings = await Booking.find({ categoriesName: categoryId })
      .populate("categoriesName") // Populate the Category details
      .exec();

    res.status(200).json({
      success: true,
      message: "List of bookings by Category",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  submitBooking,
  getAllBookings,
  getSingleBooking,
  getBookingsByUserId,
  deleteBooking,
  getBookingsByRestaurant,
  getBookingsByCategory,
  updateBookingStatus,
};
