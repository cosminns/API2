const Product=require('../models/Product');
const ErrorResponse=require('../utils/errorResponse');
const path=require('path');
const asyncHandler=require('../middleware/async');
//Get all the products
//GET /products
//access Public
exports.getProducts=async(req,res,next)=>{
    try {
        console.log(req.query);
        const products= await Product.find(req.query);
        res.status(200).json({succes:true,count:products.length, data:products})
    } catch (error) {
        next(error);
    
    }
    
}
//Get  one product
//GET /products/:id
//access Public
exports.getProduct=async(req,res,next)=>{
   
    try {
       
       const product=await Product.findById(req.params.id);
      if(!product){
          return next(new ErrorResponse(`Product not found with the id of ${req.params.id}`,404 ));
      }
       res.status(200).json({succes:true, data:product})
   } catch (error) {
   
       next(error);
   }
    
}
//Create  one product
//POST /products
//access private
exports.createProduct= async(req,res,next)=>{
    try {
        const product= await Product.create(req.body);
    res.status(201).json({
        succes:true,
        data:product
    });
        
    } catch (error) {
        next(error);
        
    }
    
}
//Update  one product
//UPDATE /products/:id
//access private
exports.updateProduct=async(req,res,next)=>{
    try {
        const product=await Product.findByIdAndUpdate(req.params.id, req.body,{
            // When we get the respawns we want the data to be the updated data
            new: true,
            runValidators:true
        });
        if(!product){
            return next(new ErrorResponse(`Product not found with the id of ${req.params.id}`,404 ));
        }
        res.status(200).json({success:true, data:product});
        
    } catch (error) {
        next(error);
    }
    
}
//Delete  one product
//DELETE /products/:id
//access private
exports.deleteProduct=async(req,res,next)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return next(new ErrorResponse(`Product not found with the id of ${req.params.id}`,404 ));
        }
        res.status(200).json({success:true, data:{}});
        
    } catch (error) {
        next(error);
    }
}
//Upload  photo for  product
//Put /products/:id/photo
//access private
exports.productPhotoUpload=asyncHandler(async(req,res,next)=>{

        const product=await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorResponse(`Product not found with the id of ${req.params.id}`,404 ));
        }
        if(!req.files){
            return next(new ErrorResponse(`Please upload a file`,404 ));

        }
        const file= req.files.file;
     //make sure the file is a photo
     if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`,404 ));
    }
    //Check file size
    if(file.size>process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than${process.env.MAX_FILE_UPLOAD}`,404 ));
    }
    //Create custom file name
    file.name=`photo_${product._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`,500 ));
        }
        await Product.findByIdAndUpdate(req.params.id,{photo: file.name});
        res.status(200).json({
            succes:true,
            data:file.name
        });
    });
    

        
});