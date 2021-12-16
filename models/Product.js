const mongoose=require('mongoose');
const slugify=require('slugify');
const ProductSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name'],
        unique:true,
        maxlength:[50, 'Name can not be more than 100 characters']

    },
    //More user friendly URL for the front end 
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
// Create product slug from the name
//ProductSchema.pre is going to run before the opperation, for when the document is saved
// It needs to pass next and also to call next();
ProductSchema.pre('save', function(next){
    //options for slugify lower:true(all lower casse)
    this.slug=slugify(this.name,{lower:true});
    next();


});
module.exports=mongoose.model('Product',ProductSchema);