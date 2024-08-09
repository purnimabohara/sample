const ShippingInfo = require("../model/shippingModel"); // Adjust the path as per your project structure
const cloudinary = require("cloudinary");
// CREATE SHIPPING INFO
// const createShippingInfo = async (req, res) => {
//     console.log(req.body);
//     const id = req.user.userId; // Assuming you have middleware to extract userId from the request

//     // Destructure data from request body
//     const {
//         userID,
//         firstName,
//         lastName,
//         address,
//         contactNumber,
//         pickUpDate,
//         returnDate,
//         specificRequirements,
//         policyAgreement1,
//         policyAgreement2
//     } = req.body;

//     // Validate the data
//     if (!userID || !firstName || !lastName || !address || !contactNumber || !pickUpDate || !returnDate || !policyAgreement1 || !policyAgreement2) {
//         return res.status(400).json({
//             success: false,
//             message: "Please provide all the required details."
//         });
//     }

//     // Try-catch block to handle errors
//     try {
//         // Check if shipping info already exists for the user
//         const existingShippingInfo = await ShippingInfo.findOne({
//             userID: id,
//             firstName: firstName,
//             lastName: lastName,
//             address: address,
//             contactNumber: contactNumber,
//             pickUpDate: pickUpDate,
//             returnDate: returnDate,
//             specificRequirements: specificRequirements,
//             policyAgreement1: policyAgreement1,
//             policyAgreement2: policyAgreement2
//         });

//         // Return error if shipping info already exists
//         if (existingShippingInfo) {
//             return res.json({
//                 success: false,
//                 message: "Shipping information already exists."
//             });
//         }

//         // Create new shipping info document
//         const newShippingInfo = new ShippingInfo({
//             userID: id,
//             firstName: firstName,
//             lastName: lastName,
//             address: address,
//             contactNumber: contactNumber,
//             pickUpDate: pickUpDate,
//             returnDate: returnDate,
//             specificRequirements: specificRequirements,
//             policyAgreement1: policyAgreement1,
//             policyAgreement2: policyAgreement2
//         });

//         // Save the new shipping info to the database
//         await newShippingInfo.save();

//         // Respond with success message
//         res.status(200).json({
//             success: true,
//             message: "Shipping information created successfully.",
//             data: newShippingInfo
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error."
//         });
//     }
// };
const createShippingInfo = async (req, res) => {
    console.log(req.body);
    const id = req.user.userId; // Assuming you have middleware to extract userId from the request

    // Destructure data from request body
    const {
        userID,
        firstName,
        lastName,
        address,
        contactNumber,
        pickUpDate,
        returnDate,
        specificRequirements,
        policyAgreement1,
        policyAgreement2
    } = req.body;

    // Validate the data
    if (!userID || !firstName || !lastName || !address || !contactNumber || !pickUpDate || !returnDate ||!specificRequirements || !policyAgreement1 || !policyAgreement2) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required details."
        });
    }

    // Try-catch block to handle errors
    try {
        // Check if shipping info already exists for the user
        const existingShippingInfo = await ShippingInfo.findOne({
            userID: id,
            firstName: firstName,
            lastName: lastName,
            address: address,
            contactNumber: contactNumber,
            pickUpDate: pickUpDate,
            returnDate: returnDate,
            specificRequirements: specificRequirements,
            policyAgreement1: policyAgreement1,
            policyAgreement2: policyAgreement2
        });

        // Return error if shipping info already exists
        if (existingShippingInfo) {
            return res.json({
                success: false,
                message: "Shipping information already exists."
            });
        }

        // Create new shipping info document
        const newShippingInfo = new ShippingInfo({
            userID: id,
            firstName: firstName,
            lastName: lastName,
            address: address,
            contactNumber: contactNumber,
            pickUpDate: pickUpDate,
            returnDate: returnDate,
            specificRequirements: specificRequirements,
            policyAgreement1: policyAgreement1,
            policyAgreement2: policyAgreement2
        });

        // Save the new shipping info to the database
        await newShippingInfo.save();

        // Respond with success message and data
        res.status(200).json({
            success: true,
            message: "Shipping information created successfully.",
            data: newShippingInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};


// Function to update shipping information for a single item in the cart
const updateSingleShippingInfo = async (shippingId, updatedShippingInfo) => {
    try {
        const updatedShipping = await ShippingInfo.findByIdAndUpdate(
            shippingId,
            { $set: updatedShippingInfo },
            { new: true }
        );

        if (!updatedShipping) {
            throw new Error('Shipping information not found');
        }

        return updatedShipping;
    } catch (error) {
        throw new Error('Error updating shipping information');
    }
};


// GET SINGLE SHIPPING INFO
const getSingleShippingInfo = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Shipping info ID is required."
        });
    }
    try {
        const singleShippingInfo = await ShippingInfo.findById(id);
        if (!singleShippingInfo) {
            return res.status(404).json({
                success: false,
                message: "Shipping info not found."
            });
        }
        res.json({
            success: true,
            message: "Shipping info fetched successfully.",
            shippingInfo: singleShippingInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// GET SHIPPING INFO BY USER ID
const getShippingInfoByUserID = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required."
        });
    }
    try {
        const shippingInfo = await ShippingInfo.find({ userID: id });
        res.json({
            success: true,
            message: "Shipping info retrieved successfully.",
            shippingInfo: shippingInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// UPDATE SHIPPING INFO
const updateShippingInfo = async (req, res) => {
    const id = req.params.id;
    const {
        userID,
        firstName,
        lastName,
        address,
        contactNumber,
        pickUpDate,
        returnDate,
        specificRequirements,
        policyAgreement1,
        policyAgreement2
    } = req.body;

    // Validate required fields
    if (!userID || !firstName || !lastName || !address || !contactNumber || !specificRequirements || !pickUpDate || !returnDate || !policyAgreement1 || !policyAgreement2) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const updatedShippingInfo = {
            userID: userID,
            firstName: firstName,
            lastName: lastName,
            address: address,
            contactNumber: contactNumber,
            pickUpDate: pickUpDate,
            returnDate: returnDate,
            specificRequirements: specificRequirements,
            policyAgreement1: policyAgreement1,
            policyAgreement2: policyAgreement2
        };

        const updatedShippingInfoResult = await ShippingInfo.findByIdAndUpdate(id, updatedShippingInfo, { new: true });

        if (!updatedShippingInfoResult) {
            return res.status(404).json({
                success: false,
                message: "Shipping info not found."
            });
        }

        res.json({
            success: true,
            message: "Shipping info updated successfully.",
            shippingInfo: updatedShippingInfoResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

module.exports = {
    createShippingInfo,
    getSingleShippingInfo,
    getShippingInfoByUserID,
    updateShippingInfo,
    updateSingleShippingInfo
};
