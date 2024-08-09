// const Menu = require("../model/menuModel");
// const Categories = require("../model/categoryModel");

// const addMenu = async (req, res) => {
//   try {
//     console.log(req.params);
//     // Step 1: Check incoming data
//     console.log(req.body);
//     // JSON data

//     // Step 2: Destructure data
//     const { menuName, categoryId } = req.body;

//     console.log(menuName);
//     console.log(categoryId);
//     // Extract restaurantId from URL params

//     // Step 3: Validate data
//     if (!menuName || !categoryId) {
//       return res.json({
//         success: false,
//         message: "Please provide a name for the menu and the category ID.",
//       });
//     }

//     // Step 4: Try-Catch block
//     try {
//       // Step 5: Create new menu
//       const newMenu = new Menu({
//         menuName: menuName,
//         categoryId: categoryId,
//       });

//       // Step 6: Save the menu
//       await newMenu.save();

//       // Step 7: Fetch the category and update its menus array
//       const category = await Categories.findById(categoryId);
//       if (!category) {
//         return res.status(404).json({
//           success: false,
//           message: "Category not found.",
//         });
//       }
//       category.menus.push(newMenu._id);
//       await category.save();

//       // Step 8: Send response
//       res.status(200).json({
//         success: true,
//         message: "Menu created successfully and added to the category .",
//         data: newMenu,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json("Server Error");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getAllMenus = async (req, res) => {
//   try {
//     //const { restaurantId } = req.params;
//     const categoryId = req.params.categoryId.trim();
//     // Find menus associated with the given restaurantId
//     const menus = await Menu.find({ categoryId: categoryId });

//     if (!menus || menus.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Menus not found for the category .",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Menus fetched successfully",
//       menus: menus,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // Get a menu by ID
// const getSingleMenu = async (req, res) => {
//   try {
//     const menu = await Menu.findById(req.params.id);
//     if (!menu) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Menu not found" });
//     }
//     res.json({
//       success: true,
//       message: "Menu fetched successfully",
//       menu: menu,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// const updateMenu = async (req, res) => {
//   console.log(req.body);

//   //destructuring
//   const { menuName } = req.body;

//   //destructure id from URL  --because id is in imageupload url
//   const id = req.params.id;
//   const categoryId = req.params.categoryId;

//   //validation
//   if (!menuName) {
//     res.json({
//       success: false,
//       message: "Enter the name!",
//     });
//   }
//   try {
//     if (menuName) {
//       const updatedMenu = {
//         menuName: menuName,
//       };
//       await Menu.findByIdAndUpdate(id, updatedMenu);
//       res.json({
//         success: true,
//         message: "Menu updated Successfully",
//         menu: updatedMenu,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// // Delete a menu
// const deleteMenu = async (req, res) => {
//   try {
//     const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
//     if (!deletedMenu) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Menu not found" });
//     }
//     res.json({ success: true, message: "Menu deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// module.exports = {
//   getAllMenus,
//   getSingleMenu,
//   addMenu,
//   updateMenu,
//   deleteMenu,
// };
