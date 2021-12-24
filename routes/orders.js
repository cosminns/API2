const express=require('express');
const {getOrders,getOrder, createOrder, updateOrder, deleteOrder}=require('../controller/orders');
const router=express.Router();
const {protect, authorize}=require('../middleware/auth');
router.route('/')
.get(protect,authorize('user','admin'),getOrders)
.post(protect,authorize('user','admin'), createOrder);
router.route('/:id')
.get(protect,authorize('user','admin'),getOrder)
.put(protect,authorize('user','admin'),updateOrder)
.delete(protect,authorize('admin'),deleteOrder);
module.exports=router;
