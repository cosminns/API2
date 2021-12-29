const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//Register user
//POST /auth/register
//access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, address } = req.body;
  //Create User
  const user = await User.create({
    name,
    email,
    password,
    address,
    role,
  });
  sendTokenResponse(user, 200, res);
});
//Login User
//POST /auth/login
//access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credential", 401));
  }
  //Check if password matchess
  //isMatch will have a true or false value
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credential", 401));
  }
  sendTokenResponse(user, 200, res);
});
//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //only from the client side scrip
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ succes: true, token });
};
//Log user out/ clear cookie
//get /auth/logout
//access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token','none',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  });
  
  res.status(200).json({ succes: true, data: {}});
});
//Get current logged in user
//POST /auth/me
//access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ succes: true, data: user });
});
//Update user details
//PUT /auth/updatedetails
//access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    address:req.body.address,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ succes: true, data: user });
});
//Update Password
//POST /auth/updatepassword
//access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  //check current password
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse("Password is incorrect", 401));
  }
  user.password=req.body.newPassword;
  await user.save();
  sendTokenResponse(user,200,res);
});
//Forgot password
//POST /auth/forgotpassword
//access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you requested the reset of a password.Please make a PUT request to:\n\ ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ succes: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent ", 500));
  }
});
//Reset password
//POST /auth/resetpassword/:resettoken
//access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get Hashed tokken
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    // Money sign operator (grater then Date.now())
    getResetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});
