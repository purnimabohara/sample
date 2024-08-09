const jwt=require('jsonwebtoken');
const authGuard=(req,res,next)=>{
//get header authorization
const authHeader= req.headers.authorization;
if(!authHeader){
    return res.json({
        success:false,
        message:"Authorization header not found!"
    })
}

//get token by splitting the header
//Format='Bearer tokenxyfghsdklk' -------bearer is defaultname for token which should be split by space
const token=authHeader.split(' ')[1];
if(!token){
    return res.json({
        success:false,
        message:"Token not found!"
    })
}
try{
    //verify token
    const decodeUser=jwt.verify(token,process.env.JWT_SECRET);
    // req.user=decodeUser;
    // Modify req.user to include additional user information
    req.user = {
        userId: decodeUser.userId,
        email: decodeUser.email,
        // Add any additional user information you want to include
        firstName: decodeUser.firstName, // Assuming you include firstName in the JWT payload
        // Add more fields as needed
      };
    next();

}catch(error){
    res.json({
        success:false,
        message:"Invalid Token"
    })
}

}
module.exports=authGuard;