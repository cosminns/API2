const express=require('express');
const {productPhotoUpload,getProducts,getProduct,createProduct,updateProduct,deleteProduct}=require('../controller/products');
const router=express.Router();
const {protect,authorize}=require('../middleware/auth');
router.route('/')
.get(getProducts)
.post(protect,authorize('admin'),createProduct);
router.route('/:id/photo').put(protect,authorize('admin'),productPhotoUpload);
router.route('/:id')
.get(getProduct)
.put(protect,authorize('admin'),updateProduct)
.delete(protect,authorize('admin'),deleteProduct);
module.exports=router;

