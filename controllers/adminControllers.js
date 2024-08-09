const Users = require("../model/userModel");



// for fetching user details in admin panel
 
const getAllUsers = async (req, res) => {
  console.log("Get all user data requste");
 
  try {
    // console.log("Before yry");
    const users = await Users.find();
    // console.log("9");
 
    if (!users) {
      console.log("No users found");
      return res.json({
        success: false,
        message: "No user found",
      });
    } else {
      return res.json({
        success: true,
        message: "user found",
        data: users,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Eroor ocurred",
    });
  }
};
const deleteUser=async(req,res)=>{
  try{
    const deletedUser=await Users.findByIdAndDelete (req.params.id);
    if(!deletedUser){
      res.json({
        success:false,
        message:"User not found!"
      })
    }
    res.json({
      success:true,
      message:"User deleted successfully"
    })

  }catch(error){
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Server Error"
    })
  
  }
}










module.exports = {
  getAllUsers,
  deleteUser
 
};