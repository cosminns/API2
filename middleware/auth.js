const jwt = require("jsonwebtoken");
const asyncHandler=require('./async');
const ErrorReponse=require('../utils/errorResponse');
const User=require('../models/User');

exports.protect= asyncHandler(async(req,res,next)=>{
let token;
if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer'))
{
    //getting the token
    //puting the req in an array and using the split method to split in 2 arrays;
    //first item in the array is beared and the second is the token
    token=req.headers.authorization.split(' ')[1];
}
//TO DO token in cookie
/* else if(req.cookie.token){
    token=req.cookie.token;
} */

//make sure token exists
if(!token){
    return next(new ErrorReponse("Not Authorized to access this route",401));

}
try{
    //verify token
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log(decoded);
    req.user=await User.findById(decoded.id);
    next();
}
catch(err){
    return next(new ErrorReponse("Not Authorized to access this route",401));

}
});
//Grand access by roles
exports.authorize=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorReponse(`User role ${req.user.role} is not authorized to acces this route`,403));
        }
        next();
    }
}