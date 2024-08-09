const cloudinary = require("cloudinary");
const Categories = require("../model/categoryModel");

// CRUD for category
const addCategory = async (req, res) => {
  try {
    // Step 1: Check incoming data
    console.log(req.body); // JSON data
    console.log(req.files); // Uploaded files

    // Step 2: Destructure data
    const { categoryName } = req.body;

    const { categoryImage } = req.files;

    // Step 3: Validate data
    if (!categoryName || !categoryImage) {
      return res.json({
        success: false,
        message: "Please provide name and image for the category.",
      });
    }

    // Step 4: Try-Catch block
    try {
      // Step 5: Upload image to Cloudinary
      const uploadedImage = await cloudinary.v2.uploader.upload(
        categoryImage.path,
        {
          folder: "categories",
          crop: "scale",
        }
      );

      // Step 6: Save the category
      const newCategory = new Categories({
        categoryName: categoryName,

        categoryImageUrl: uploadedImage.secure_url,
      });
      await newCategory.save();

      // Step 7: Send response
      res.status(200).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const listOfCategories = await Categories.find({}).populate({
      path: "items"
     
    });
    res.json({
      success: true,
      message: "Category fetched sucessfully",
      categories: listOfCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};
//get category by id
const getSingleCategory = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "category ID is required!",
    });
  }
  try {
    const singleCategory = await Categories.findById(id);
    res.json({
      success: true,
      message: "category fetched successfully",
      category: singleCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const updateCategory = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  //destructuring
  const { categoryName } = req.body;
  const { categoryImage } = req.files;

  //destructure id from URL  --because id is in imageupload url
  const id = req.params.id;

  //validation
  if (!categoryName) {
    res.json({
      success: false,
      message: "Name of Category is required!",
    });
  }
  try {
    if (categoryImage) {
      const uploadedImage = await cloudinary.v2.uploader.upload(
        categoryImage.path,
        {
          folder: "categories",
          crop: "scale",
        }
      );
      //update the category
      const updatedCategory = {
        categoryName: categoryName,

        categoryImageUrl: uploadedImage.secure_url
      };
      await Categories.findByIdAndUpdate(id, updatedCategory);
      res.json({
        success: true,
        message: "Category updated Successfully",
        category: updatedCategory,
      });
    } else {
      const updatedCategory = {
        categoryName: categoryName
      };
      await Categories.findByIdAndUpdate(id, updatedCategory);
      res.json({
        success: true,
        message: "Category updated Successfully without image",
        category: updatedCategory,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



//delete category
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Categories.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      res.json({
        success: false,
        message: "Category not found!",
      });
    }
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addCategory,
  getSingleCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
