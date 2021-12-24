const express= require('express');
const path=require('path');
const dotenv=require('dotenv');
const morgan=require('morgan');
const colors=require('colors');
const fileupload=require('express-fileupload');
const cookieParser=require('cookie-parser');
const errorHandle=require('./middleware/error');
const connectDB=require('./config/db');
//load config information
dotenv.config({ path: './config/config.env' });
//Connect to database
connectDB();
//Route Files
const products=require('./routes/products');
const orders=require('./routes/orders');
const auth=require('./routes/auth');
const serv=express();
//Body parser
serv.use(express.json());
//cookie parser
serv.use(cookieParser());
//dev logging middleware
if(process.env.NODE_ENV==='development'){
    serv.use(morgan('dev'));
}
//file uploading
serv.use(fileupload());
//set static folder
serv.use(express.static(path.join(__dirname,'public')));
//Mount routers
serv.use('/products', products);
serv.use('/orders', orders);
serv.use('/auth', auth);
serv.use(errorHandle);

 const PORT=process.env.PORT||3000;
 const server=serv.listen(
     PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
//Handle unhandled promise rejections
//if the app can not connect to database, the app will not run after
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.mesage}`.red);
    server.close(()=> process.exit(1));

}); 