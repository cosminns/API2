const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
//Get all the orders
//GET /orders
//access Public
exports.getOrders = async (req, res, next) => {
  try {
    console.log(req.query);
    const orders = await Order.find(req.query).populate(
      "idOfProducts",
      
    );
    res.status(200).json({ succes: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}; //Get one order
//GET /orders
//access Public
exports.getOrder = asyncHandler(async (req, res, next) => {

  
    const order = await Order.findById(req.params.id).populate(
      "idOfProducts",
      
    );
    

    if (!order) {
      return next(
        new ErrorResponse(
          `Order not found with the id of ${req.params.id}`,
          404
        )
      );
    } 
    if(req.user.role!=="admin"){
    if ( order.userId.toString() !== req.user.id && req.user.role  !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to get this order`,
          401
        )
      );
    }
  }
    res.status(200).json({ succes: true, data: order });
  
});

//Create  one order
//POST /orders
//access private
exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      succes: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
//Update order
//Update /orders
//access private
/* exports.updateOrder = asyncHandler(async(req,res,next)=>{
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this order`,
        401)
    );
  }
  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: order });
}) */
exports.updateOrder = asyncHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(
        new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
      );
    }
  
    // Make sure user is admin
    //Only an admin can update an order
    if (  req.user.role  !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this order`,
          401
        )
      );
    }
  
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({ success: true, data: order });
  });
//Delete  one order
//DELETE /orders/:id
//access private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
 
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new ErrorResponse(
          `Order not found with the id of ${req.params.id}`,
          404
        )
      );
    }
    // Make sure user is admin
    //Only an admin can update an order
    if (  req.user.role  !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this order`,
          401
        )
      );
    }
    order.remove();
    res.status(200).json({ success: true, data: {} });
 
});
//order should have same id as the user
/* order.userId.toString() !== req.user.id && */