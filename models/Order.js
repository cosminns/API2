const mongoose=require('mongoose');
const Product = require('./Product');

const OrderSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    

    },
    
    idOfProducts:{
        type:[mongoose.Schema.ObjectId],
        ref:'Product',
        required:true

        
    },
    ammount:{
        type:Number,
        min:1,
        
    },
   
    orderIsCompleted:{
        type:Boolean,
        default: false,

    },
    createAt:{
        type:Date,
        default:Date.now
    }
   
    
});

//Static method to get the ammount for a order
/* const howMany=this.idOfProducts.lenght;
let sum=0;
for(let i=0;i<howMany;i++)
{
    sum=Product.findById(idOfProducts[i]);


}
//call ammount after save


OrderSchema.post('save',function(){

this.ammount=
}); */
module.exports=mongoose.model('Order',OrderSchema);