const express = require('express');
const app = express();
const productsrouter = require('./api/routes/products');
const ordersrouter = require('./api/routes/orders');
const userrouter = require('./api/routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shashanktupakulaiitkgp2021:Sravanthic%4012@cluster0.hzhdddq.mongodb.net/?retryWrites=true&w=majority');
app.use(morgan('dev')); // its a middle ware function // this will give us what type of requests we are getting and what are the responses going out 
app.use('/uploads',express.static('uploads')); // to make a folder freely available we do this with that publicly available
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // this middle ware is to extract the request body from json and url encoded format
// we put another middle ware for cors errors 
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-Width,Content-Type,Accept,Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT POST GET PATCH DELETE');
        return res.status(200).json({});   // this is the way we handle the cors errors in the application 
    }
    next();
});
app.use('/products',productsrouter); // it adds a router to all the pages that are having /products
app.use('/orders',ordersrouter);
app.use('./users',userrouter);

// here we add an additional middle ware to handle the requests that havent been handled by above ones 
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); // sending the error to the next function 
})

app.use((error,req,res,next)=>{  // this is to handle any error thrown at any point of time of this all things like the database errors
    res.status(error.status||500);
    res.json({
        error: {
            message: error.message,
            status:error.status
        }
    })
})
module.exports = app;