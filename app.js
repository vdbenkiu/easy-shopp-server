const express = require('express');
const app=express();
const bodyParser=require('body-parser');
const morgan=require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');


const dotenv = require("dotenv");
dotenv.config();

const Product=require('./models/product');

const productsRouter=require('./routers/products');
const categoriesRouter=require('./routers/categories');
const ordersRouter=require('./routers/orders');
const usersRouter=require('./routers/users');
const router = require('./routers/products');
const authJwt = require('./helpers/jwt');
const errorHandler=require('./helpers/error-handler');


app.use(cors());
app.options('*',cors());


app.use (bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('the user is not authorized');
    }
    if(err.name === 'ValidationError'){
        return res.status(401).json({message:err});
    }
return res.status(500).json(err);
  });


const api=process.env.API_URL;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);
app.use(`${api}/users`,usersRouter);




mongoose.connect(process.env.CONNECT_STRING,
    {
        
        
       useNewUrlParser: true, 
       useUnifiedTopology: true ,
        dbName:"Eshop-database2"
      }
    )
    
    .then(()=>{
        console.log('database Connect is ready...')
    })
    .catch((err)=>{
        console.log(err)
    });




// production
// var server= app.listen(process.env.PORT || 3000 , function () {
//   var port = server.address().port;
//   console.log("Express is working on port"+ port)
// })
var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
