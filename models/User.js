const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const UserSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please add a email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'Please add a valid email'],
        unique:true,
       

    },
    
    password:{
        type:String,
        required:[true, 'Please add a password'],
        minlength:[6, 'Password can not be less than 6 characters'],
        select: false
    },
    resetPasswordToken: String ,
    resetPasswordExpire:Date,
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    address:
    {
        type:String,
        required:[true,'Please add a address'],

    },
    
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'

    },
   
    createdAt:{
        type:Date,
        default:Date.now
    }
});
//Encrypt password ussing bcrypt
UserSchema.pre('save', async function(next){
const salt= await bcrypt.genSalt(10);
this.password=await bcrypt.hash(this.password,salt);
});
//Sign JWT and return
UserSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}
//Match user entered password to hashed password in database
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model('User',UserSchema);