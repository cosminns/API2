const mongoose=require('mongoose');
const Product = require('./Product');

const OrderSchema= new mongoose.Schema({
    userEmail:{
        type:String,
        required:[true, 'Please add a email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'Please add a valid email'],
       
        maxlength:[100, 'Email can not be more than 100 characters'],
    

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