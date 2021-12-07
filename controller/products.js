const Product=require('../models/Product');
//Get all the products
//GET /products
//access Public
exports.getProducts=async(req,res,next)=>{
    try {
        const products= await Product.find();
        res.status(200).json({succes:true,count:products.length, data:products})
    } catch (error) {
        res.status(400).json({succes:false});
    }
    
}
//Get  one product
//GET /products/:id
//access Public
exports.getProduct=async(req,res,next)=>{
   try {
       const product=await Product.findById(req.params.id);
      if(!product){
          return res.status(400).json({success:false});
      }
       res.status(200).json({succes:true, data:product})
   } catch (error) {
    res.status(400).json({succes:false});
       
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
        res.status(400).json({success:false})
        
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
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:product});
        
    } catch (error) {
        res.status(400).json({success:false});
    }
    
}
//Delete  one product
//DELETE /products/:id
//access private
exports.deleteProduct=async(req,res,next)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:{}});
        
    } catch (error) {
        res.status(400).json({success:false});
    }
};