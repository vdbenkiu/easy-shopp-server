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
app.get('/', (req, res) => {
  res.json({
    mesage: 'Server is running'
  });
})
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));



app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
     return res.status(401).json({success:false,error:err});
    }
    if(err.name === 'ValidationError'){
       return  res.status(401).json({message:err});
    }
     res.status(500).json(err);
  });


const api=process.env.API_URL;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);
app.use(`${api}/users`,usersRouter);




// mongoose.connect(process.env.CONNECT_STRING,
//     {
        
        
//        useNewUrlParser: true, 
//        useUnifiedTopology: true ,
//         dbName:"Eshop-database2"
//       }
//     )
    
//     .then(()=>{
//         console.log('database Connect is ready...')
//     })
//     .catch((err)=>{
//         console.log(err)
//     });
var res = [];
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://LVDshop:lvd123456789@cluster0.je6rh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { dbName:"Eshop-database2" ,useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }).connect();
// client.connect(err => {
//   const conect = client.db("Eshop-database2");
//   // perform actions on the collection object
//   // const collection=conect.collection("products");
//   //     // Fetching the records of name key
//   //     collection.find({ }).project({name:1})
//   //     .toArray().then((values) => {

//   //     // Printing the values
//   //     console.log(values);
//   // });
//   //client.close();
// });


var server =app.listen(process.env.PORT || 80, function(){
  var port=server.address().port;
  console.log("Express is working on port" + port)
})
