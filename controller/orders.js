const Order=require('../models/Order');
const Product=require('../models/Product');
const ErrorResponse=require('../utils/errorResponse');
//Get all the orders
//GET /orders
//access Public
exports.getOrders=async(req,res,next)=>{
    try {
        console.log(req.query);
        const orders= await Order.find(req.query).populate('idOfProducts');
        res.status(200).json({succes:true,count:orders.length, data:orders})
    } catch (error) {
        next(error);
    
    }
    
}//Get one order
//GET /orders
//access Public
exports.getOrder=async(req,res,next)=>{
    try {
        console.log(req.query);
        const order= await Order.find(req.param.id).populate('idOfProducts');
        
        if(!order){
            return next(new ErrorResponse(`Order not found with the id of ${req.params.id}`,404 ));
        }
         res.status(200).json({succes:true, data:order})
     } catch (error) {
     
         next(error);
     }
    
}
//Create  one order
//POST /orders
//access private
exports.createOrder= async(req,res,next)=>{
    try {
        const order= await Order.create(req.body);
    res.status(201).json({
        succes:true,
        data:order
    });
        
    } catch (error) {
        next(error);
        
    }
    
}
//Update order
//Update /orders
//access private
exports.updateOrder=async(req,res,next)=>{
    try {
        const order=await Order.findByIdAndUpdate(req.params.id, req.body,{
            // When we get the respawns we want the data to be the updated data
            new: true,
            runValidators:true
        });
        if(!Order){
            return next(new ErrorResponse(`Order not found with the id of ${req.params.id}`,404 ));
        }
        res.status(200).json({success:true, data:order});
        
    } catch (error) {
        next(error);
    }
    
}
//Delete  one order
//DELETE /orders/:id
//access private
exports.deleteOrder=async(req,res,next)=>{
    try {
        const order=await Order.findByIdAndDelete(req.params.id);
        if(!order){
            return next(new ErrorResponse(`Order not found with the id of ${req.params.id}`,404 ));
        }
        res.status(200).json({success:true, data:{}});
        
    } catch (error) {
        next(error);
    }
};
