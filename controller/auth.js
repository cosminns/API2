const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/async');
const User=require('../models/User');
//Register user
//POST /auth/register
//access Public
exports.register= asyncHandler(async(req,res,next)=>{

    const{name,email,password,role,address}=req.body;
    //Create User
    const user=await User.create({
        name,
        email,
        password,
        address,
        role


    });
    sendTokenResponse(user,200,res);

});
//Login User
//POST /auth/login
//access Public
exports.login= asyncHandler(async(req,res,next)=>{

    const{email,password}=req.body;
    //Validate email and password
    if(!email||!password){
        return next(new ErrorResponse('Please provide an email and password',400));
    }
    const user= await User.findOne({email}).select('+password');
   if(!user){
    return next(new ErrorResponse('Invalid credential',401));

   }
   //Check if password matchess
   //isMatch will have a true or false value 
   const isMatch=await user.matchPassword(password);
   if(!isMatch){
    return next(new ErrorResponse('Invalid credential',401));
   }
    sendTokenResponse(user,200,res);

});
//get token from model, create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //Create Token
    const token=user.getSignedJwtToken();
    const options={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        //only from the client side scrip
        httpOnly:true
    };
    res.status(statusCode).cookie('token',token,options).json({succes:true,token});
}
//Get current logged in user
//POST /auth/me
//access Private
exports.getMe=asyncHandler(async(req,res,next)=>{

const user=await User.findById(req.user.id);
res.status(200).json({succes:true, data:user});
});