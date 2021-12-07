const express= require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const connectDB=require('./config/db');
const colors=require('colors');

//load config information
dotenv.config({ path: './config/config.env' });
//Connect to database
connectDB();
//Route Files
const products=require('./routes/products');
const serv=express();
//Body parser
serv.use(express.json());
//dev logging middleware
if(process.env.NODE_ENV==='development'){
    serv.use(morgan('dev'));
}
//Mount routers
serv.use('/products', products);

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