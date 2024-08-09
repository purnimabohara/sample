// import
const router = require("express").Router();
const userController = require("../controllers/userControllers");
const categoryController = require("../controllers/categoryControllers");
// const menuController = require("../controllers/menuControllers");
const itemController = require("../controllers/itemControllers");
const requestController = require("../controllers/requestControllers");
const bookingController = require("../controllers/bookingController");
const cartController = require("../controllers/cartControllers");
const shippingInfoController = require("../controllers/shippingControllers");
const orderController = require("../controllers/orderControllers");
const ratingController = require("../controllers/ratingControllers");





const authGuard = require("../middleware/authGuard");

const generateRandomKey = require("../key Generator");

// Example usage
const key = generateRandomKey();
console.log("Generated Key:", key);

// create user api
router.post("/create", userController.createUser);

//  task 1: create login api
router.post("/login", userController.loginUser);

router.get("/verify/:id", userController.verifyMail);
router.post("/forgot/password", userController.forgotPassword);
router.put("/password/reset/:token", userController.resetPassword);
router.put("/updateUser/:id", userController.updateUserData);
router.put("/changePassword/:userId", userController.changePassword);

// router.put("/updateUser", userController.updateUser);

//get  all restaurants,categories,items
router.get("/get_categories", categoryController.getAllCategories);
router.get("/get_category/:id", categoryController.getSingleCategory);
//update Categories API
// router.get("/get_menu/:id", menuController.getSingleMenu);
router.get("/get_item/:id", itemController.getSingleItem);
// router.get("/get_all_menus");

//request
router.post("/submit-request", authGuard, requestController.submitRequest);
router.get( "/get_requestsbyUser/:id",  authGuard, requestController.getRequestsByUserId
);

//For booking
router.post("/submit-booking", authGuard, bookingController.submitBooking);
router.get("/get_booking/:id", authGuard, bookingController.getSingleBooking);
router.get(
  "/get_bookingbyUser/:id",
  authGuard,
  bookingController.getBookingsByUserId
);
//for updating status

router.put("/updateStatus/:id", bookingController.updateBookingStatus);
router.put("/updateRequestStatus/:id", requestController.updateRequestStatus);
router.get('/search', itemController.searchItemsByName);


//Addto cart route

router.post('/addToCart', authGuard, cartController.addToCart)
router.get('/getCartByUserID/:id', authGuard, cartController.getCartByUserID)
router.get("/getSingleCart/:id", cartController.getSingleCart)
router.put("/updateCart/:id", authGuard, cartController.updateCart)
router.delete("/removeFromCart/:id", authGuard, cartController.removeFromCart)

//shipping info
router.post('/createShippingInfo', authGuard, shippingInfoController.createShippingInfo)
router.get('/getShippingInfoByUserID/:id', authGuard, shippingInfoController.getShippingInfoByUserID)
router.get('/getSingleShippingInfo/:id', shippingInfoController.getSingleShippingInfo)
router.put('/updateShippingInfo/:id', authGuard, shippingInfoController.updateShippingInfo)

//order
router.post('/createOrder', authGuard, orderController.createOrder)
router.get('/getSingleOrder/:id', orderController.getSingleOrder)
router.get('/getOrderByUserID/:id', orderController.getOrderByUserID)


//rating
router.post('/upsertRating', authGuard, ratingController.upsertRating);
router.get('/rating/:userId', authGuard, ratingController.fetchUserRatings);



module.exports = router;
