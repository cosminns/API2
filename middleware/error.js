const ErrorResponse = require("../utils/errorResponse");

const errorHandler=(err,req,res,next)=>{
    let error={...err};
    error.message=err.message;
    //log to console in dev mode
    console.log(err);
    //Mongoose bad ObjectId, if there is sent a get request with no id found in database
    if(err.name==='CastError'){
        const message=`Resource not found with the id of ${err.value}`;
     error=new ErrorResponse(message, 404);
    }
    //Mongoose duplicate key, if someone tries to create a resource with a unique key one more time with the same unique key
    if(err.code===11000){
      const message='Duplicate field value entered';
      error= new ErrorResponse(message,400);  
    }
    //Mongoose validation error
    if(err.name ==='ValidationError'){
        //Object.values is the way to get just the values from the err.errors(Object.values(err.errors))
        //We want just the messages we map through each one and extract what we want(Object.values(err.errors).map)
        // for each value I get val.message(val=>val.message)
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message,400);
    }
    res.status(error.statusCode|| 500).json({
        succes:false,
        error: error.message||'Server Error'
    });
};
module.exports=errorHandler;