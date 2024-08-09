const route = require("express").Router();
const adminController = require("../controllers/adminControllers");
const categoryController = require("../controllers/categoryControllers");
// const menuController = require("../controllers/menuControllers");
const itemController = require("../controllers/itemControllers");
const requestController = require("../controllers/requestControllers");
const bookingController = require("../controllers/bookingController");
const orderController=require("../controllers/orderControllers")
const authGuard = require("../middleware/authGuard");

//USER DETAILS

route.get("/getAllUser", adminController.getAllUsers);
route.delete("/deleteUser/:id", authGuard, adminController.deleteUser);

//for RESTAURANTS

//Create restaurant API
route.post("/add-category", authGuard, categoryController.addCategory);

//update restaurant API
route.put("/update_category/:id", authGuard, categoryController.updateCategory);

//delete restaurant API
route.delete(
  "/delete_category/:id",
  authGuard,
  categoryController.deleteCategory
);
//to check after api call and before moving to the content

//for MENUS

//Create menu API
// route.post("/add-menu", authGuard, menuController.addMenu);
// route.delete("/delete_menu/:id", authGuard, menuController.deleteMenu);

// route.put("/update_menu/:id", authGuard, menuController.updateMenu);

//For Request
route.get("/get_requests", authGuard, requestController.getAllRequests);
route.get("/get_request/:id", authGuard, requestController.getSingleRequest);
route.delete("/delete_request/:id", authGuard, requestController.deleteRequest);


//for Items
route.post("/add-item", authGuard, itemController.addItem);

//update item API
route.put("/update_item/:id", authGuard, itemController.updateItem);

//delete item API
route.delete("/delete_item/:id", authGuard, itemController.deleteItem);

// For booking
route.get("/get_bookings", authGuard, bookingController.getAllBookings);

route.delete("/delete_booking/:id", authGuard, bookingController.deleteBooking);

//order
route.get('/getAllOrders',authGuard, orderController.getAllOrders)
route.put('/updateOrderStatus/:id', authGuard, orderController.updateOrderStatus)
route.put("/updateReturnStatus/:id",authGuard, orderController.updateReturnStatus);
route.delete('/cancelOrder/:id', authGuard, orderController.cancelOrder);
module.exports = route;
