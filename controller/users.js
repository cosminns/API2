const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
//Get all users
//get /auth/users
//access Private/Admin role
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users= await User.find(req.query);
    res.status(200).json({succes:true,count:users.length, data:users})
});
//Get one user
//get /auth/users/:id
//access Private/Admin role
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    succes: true,
    data: user,
  });
});
//Create User
//get /auth/users/
//access Private/Admin role
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    succes: true,
    data: user,
  });
});
//Update User
//PUT /auth/users/
//access Private/Admin role
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
      succes: true,
      data: user,
    });
  });
//Delete User
//DELETE /auth/users/
//access Private/Admin role
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      succes: true,
      data: {},
    });
  });