const mongoose = require('mongoose');
const cloudinary = require("cloudinary");
const Item = require('../model/itemModel');
const Categories = require("../model/categoryModel");


const getItemsByCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body; 

    // Array to hold promises for each category query
    const categoryQueries = categoryIds.map(categoryId => {
      // Query items for each category ID
      return Item.find({ categoryId: categoryId }).populate('categoryId');
    });

    // Execute all category queries concurrently
    const categoryResults = await Promise.all(categoryQueries);

    // Combine the results into a single array of items
    const items = categoryResults.reduce((acc, curr) => acc.concat(curr), []);

    res.json({
      success: true,
      message: 'Items fetched successfully',
      items: items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const searchItemsByName = async (req, res) => {
  try {
    const { itemName, categoryName, categoryId } = req.query;
    let query = {};

    // Build the query based on itemName and categoryName
    if (itemName) {
      query.itemName = { $regex: itemName, $options: 'i' };
    }
    if (categoryName) {
      query.categoryName = { $regex: categoryName, $options: 'i' };
    }
    if (categoryId) {
      query.categoryId = categoryId; // Assuming `categoryId` field in Item model
    }

    const items = await Item.find(query);

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error searching items:", error);
    res.status(500).json({ error: 'An error occurred while searching items' });
  }
};
//adding items from admin
const addItem = async (req, res) => {
  try {
    console.log(req.body); // JSON data
    console.log(req.files);

    const { itemName,size,material,colour,weight, itemSecurityDeposit, itemPrice,owner,contact,quantity,categoryId } = req.body;

    
    const { itemImage } = req.files;
   // Retrieve categoryId from URL parameters

  

    if (!itemName || !size || !material || !colour || !weight || !itemPrice || !itemImage || !owner ||!contact ||!categoryId || !quantity || ! itemSecurityDeposit) {
      return res.json({
        success: false,
        message: "Please provide all fields for the item.",
      });
    }
    const category = await Categories.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    try {
      // Upload image to Cloudinary
      const uploadedImage = await cloudinary.v2.uploader.upload(itemImage.path, {
        folder: "items",
        crop: "scale",
      });

      const newItem = new Item({
        itemName: itemName,
        size:size,
        material:material,
        colour:colour,
        weight:weight,
        owner:owner,
        contact:contact,
        itemPrice: itemPrice,
        quantity:quantity,
        itemImage: uploadedImage.secure_url,
        itemSecurityDeposit: itemSecurityDeposit,
        categoryId:categoryId,// Assigning the categoryId from URL parameters
        categoryName: category.categoryName
      });

      await newItem.save();

      // Find the category associated with the categoryId
      // const category = await Categories.findById(categoryId);

      // Add the new item's ID to the items array in the category
      category.items.push(newItem._id);
      await category.save();

      res.status(200).json({
        success: true,
        message: "Item created successfully",
        data: newItem,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Fetching all items 

const getAllItems = async (req, res) => {
  try {
    const { categoryId } = req.params;
    

    
    const isValidCategoryId = mongoose.Types.ObjectId.isValid(categoryId);
   

    if (!isValidCategoryId) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId  format.",
      });
    }

    // Find the category first to ensure it belongs to the specified restaurant
    // const category = await Categories.findOne({ _id: cateoryId, categoryId: categoryId });
    const category = await Categories.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Find items associated with the given categoryId
    const items = await Item.find({ categoryId: categoryId });
    console.log(categoryId);
    console.log(items);

    if (!items || items.length === 0 ) {
      return res.status(404).json({
        success: false,
        message: "Items not found for the specified category.",
      });
    }

    res.json({
      success: true,
      message: "Items fetched successfully",
      items: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


;
  const getSingleItem = async (req, res) => {
    console.log(req.params); 
    try {
      const item = await Item.findById(req.params.id).populate({
        path: 'categoryId',
       
      });
      
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      console.log(item); 
      res.json({
        success: true,
        message: "Item fetched successfully",
        item: item,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    
  };
  

const updateItem = async (req, res) => {

    console.log(req.body);
    console.log(req.files);

    const { itemName, quantity,size,material,colour,weight, itemPrice,contact,owner, itemSecurityDeposit } = req.body;
    const { itemImage } = req.files;
    const id = req.params.id;
    const categoryId = req.params.categoryId;

    if (!itemName || !size ||!material ||!colour ||!weight || !itemPrice ||!owner ||!contact ||!quantity || !itemSecurityDeposit) 
    {
      res.json({
        success: false,
        message: "All fields are required!",
      });
    }

    try {
      if (itemImage) {
        const uploadedImage = await cloudinary.v2.uploader.upload(itemImage.path, 
          {
          folder: "items",
          crop: "scale",
        }
        );
        const updatedItem = {
          itemName: itemName,
          size:size,
          material:material,
          colour:colour,
          weight:weight,
          itemSecurityDeposit: itemSecurityDeposit,
          itemPrice: itemPrice,
          contact:contact,
          owner:owner,
          quantity:quantity,
          itemImage: uploadedImage.secure_url,
          

        };
        await Item.findByIdAndUpdate(id, updatedItem);
        res.json({
          success: true,
          message: "Item updated Successfully",
          item: updatedItem,
        })
      } else {
        const updatedItem = {
          itemName: itemName,
          size:size,
          material:material,
          colour:colour,
          weight:weight,
          itemPrice: itemPrice,
          contact:contact,
          owner:owner,
          itemSecurityDeposit: itemSecurityDeposit,
          quantity:quantity
         
        }
        await Item.findByIdAndUpdate(id, updatedItem);
        res.json({
          success: true,
          message: "Item updated Successfully without image",
          item: updatedItem,
        })
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };



const deleteItem = async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };















module.exports = {
  addItem,updateItem,getItemsByCategories,
  getAllItems, getSingleItem, deleteItem,searchItemsByName
};
