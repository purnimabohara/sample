// controllers/restaurantRequestController.js
const cloudinary = require("cloudinary");
const Requests = require("../model/requestModel");

const submitRequest = async (req, res) => {
  const userId = req.user.userId;
 
  //step1:check incoming data
  console.log(req.body);
  console.log(req.files);  //body only json file

  //step2:Destructuring
  const { userName, productName, phone,size,material,colour,weight,quantity,price} = req.body;
  const { productImage } = req.files;


  //step 3:validate data
  if ( !userName|| !productName || !phone || !size || !material || !colour|| !weight|| !quantity || !price || !productImage) {
    return res.json({
      success: false,
      message: "please fill all the fields.",
    });
  }

  //step 4: try catch block
  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(
      productImage.path,
      {
        folder: "requests",
        crop: "scale",
      }
    );
    //step6: save the product
    const newRequest = new Requests({
      userName:userName,
      productName: productName,
      phone: phone,
      size:size,
      material:material,
      colour:colour,
      weight:weight,
      quantity:quantity,
      price: price,
      productImageUrl: uploadedImage.secure_url,
      requestedBy:userId,
      


    });
    await newRequest.save();
    res.status(200).json({
      success: true,
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Requests.find();
    res.json({
      success: true,
      message: "Requests fetched successfully",
      requests: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSingleRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res
        .status(400)
        .json({ success: false, message: "Request ID is required!" });
    }
    const request = await Requests.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.json({
      success: true,
      message: "Request fetched successfully",
      request,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res
        .status(400)
        .json({ success: false, message: "Request ID is required!" });
    }
    const deletedRequest = await Requests.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { requestStatus } = req.body;

    console.log(requestId);
    console.log(requestStatus);

    // Check if the bluebook with the given ID exists
    const request = await Requests.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Update the bluebook status
    request.requestStatus = requestStatus;
    await request.save();

    return res.json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getRequestsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const allRequests = await Requests.find({ requestedBy: userId });
   
   
    res.json({
      success: true,
      message: "All requests by the user is fetched successfully.",
      requests: allRequests,
    });
    console.log(allRequests);
    // Check if the user exists
  } catch (error) {
    console.error("Error fetching requests details.");
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  submitRequest,
  getAllRequests,
  deleteRequest,
  getSingleRequest,
  updateRequestStatus,
  getRequestsByUserId
};
