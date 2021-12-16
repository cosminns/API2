const mongoose=require('mongoose');

const OrderSchema= new mongoose.Schema({
    userEmail:{
        type:String,
        required:[true, 'Please add a email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'Please add a valid email'],
        unique:true,
        maxlength:[100, 'Email can not be more than 100 characters']

    },
    
    password:{
        type:String,
        required:[true, 'Please add a password'],
        maxlength:[600, 'Password can not be more than 100 characters']
    },
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    address:
    {
        typer:String,
        required:[true,'Please add a address'],

    },
    
    isAdmin:{
        type:Boolean,
        default:false

    },
   
    
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