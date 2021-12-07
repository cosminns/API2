const mongoose=require('mongoose');
const ProductSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name'],
        unique:true,
        maxlength:[50, 'Name can not be more than 100 characters']

    },
    slug: String,
    description:{
        type:String,
        required:[true, 'Please add a description'],
        maxlength:[600, 'Description can not be more than 100 characters']
    },
    price:{
        type:Number,
        min:1,
        required:[true,'Please add a price']
    },
    brand:
    {
        typer:Number,

    },
    ingrediends:{
        type:String,
        required:[true,'Please add the ingrediends'],
        maxlength:[400,'Ingrediends can not be more than 400 characters']
    },
    typeOfProduct:{
        type:Number,
        min:0,

    },
    isInStock:{
        type:Boolean,
        required:[true],

    },
    photo:{
        type:String,
        default: 'photo.jpg'

    }
    
});
module.exports=mongoose.model('Product',ProductSchema);