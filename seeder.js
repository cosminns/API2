const fs= require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const colors=require('colors');
//Load env variables
dotenv.config({path:'./config/config.env'});
//Load models
const Product=require('./models/Product');
const Order=require('./models/Order');
const User=require('./models/User');
//connect to database
mongoose.connect(process.env.MONGO_URI);
//read the data
//utf-8 enconding type
const products=JSON.parse(fs.readFileSync(`${__dirname}/data/products.JSON`,'utf-8'));
const orders=JSON.parse(fs.readFileSync(`${__dirname}/data/orders.JSON`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/data/users.JSON`,'utf-8'));
//Import into database

const importData=async ()=>{
    try {
        await Product.create(products);
        await Order.create(orders);
        await User.create(users);
        console.log('Data inserted'.green);
        process.exit();
    } catch (error) {
        console.error(error);
        
    }
}
const deleteData=async ()=>{
    try {
        await Product.deleteMany();
        await Order.deleteMany();
        await User.deleteMany();
        console.log('Data Deleted'.red);
        process.exit();
    } catch (error) {
        console.error(error);
        
    }
}
// node seeder -i to import and node seeder -d to delete
if(process.argv[2]==='-i'){
importData();
}
else if(process.argv[2]==='-d'){
    deleteData();
}