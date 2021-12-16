const express= require('express');
const path=require('path');
const dotenv=require('dotenv');
const morgan=require('morgan');
const connectDB=require('./config/db');
const colors=require('colors');
const errorHandle=require('./middleware/error');
const fileupload=require('express-fileupload');
//load config information
dotenv.config({ path: './config/config.env' });
//Connect to database
connectDB();
//Route Files
const products=require('./routes/products');
const orders=require('./routes/orders');
const { append } = require('express/lib/response');
const serv=express();
//Body parser
serv.use(express.json());
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
serv.use(errorHandle);

 const PORT=process.env.PORT;
 const server=serv.listen(
     PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
//Handle unhandled promise rejections
//if the app can not connect to database, the app will not run after
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.mesage}`.red);
    server.close(()=> process.exit(1));

}); 