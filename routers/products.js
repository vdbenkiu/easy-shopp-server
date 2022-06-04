const {Product}=require('../models/product');
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const { Categories } = require('../models/category');
const multer=require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/Desktop/DA_CNTT/BACKEND2/public/uploads')
//     },
//     filename: function (req, file, cb) {
//       const fileName=file.originalname.split('').join('-');
//       cb(null, fileName + '-' + Date.now())
//     }
//   })
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage });
  
  

router.get(`/`,async(req,res)=>{
    const productList=await Product.find().populate('categories');

    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})
router.get(`/:id`,async (req,res) =>{
    const product=await Product.findById(req.params.id).populate('categories');
    
   if(!product){
       res.status(500).json({success: false})
   }
   
    res.send(product);
})
router.post(`/`,uploadOptions.single('image'), async (req,res) =>{
    const categories= await Categories.findById(req.body.categories);
    if(!categories) return res.status(400).send('Invali Category');

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const fileName=req.file.filename;
    const basePath=`${req.protocol}://${req.get('host')}/public/upload/`;
    let product=new Product({
       name: req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription,
       image:`${basePath}${fileName}`,//"http://localhost:3000/public/upload/image-2323232"
       brand:req.body.brand,
       price:req.body.price,
       categories:req.body.categories,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReviews,
       isFeatured:req.body.isFeatured,
    })
    product=await product.save();
    

    if(!product)
        return res.status(500).send('the product cannot be create!')
        
       res.send(product);
    

    
     
 })
 router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id');
    }

    const product=await Product.findByIdAndUpdate(
        req.params.id,
        {
       name: req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription,
       image:req.body.image,
       brand:req.body.brand,
       price:req.body.price,
       categories:req.body.categories,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReviews,
       isFeatured:req.body.isFeatured,
        },
        { new:true}
    )
    if(!product)
    return res.status(500).send('the product cannot be update!')
    res.send(product);
})
router.delete('/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:'the product is delete!'})
        }else{
            return res.status(404).json({success: false,message:'the product not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})
router.get(`/get/count`,  async(req, res) => {
    let productCount = await Product.countDocuments();
  
    if(!productCount){
      res.send(500).json({success:false})
    }
  
    res.send({productCount: productCount})
  });
  router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
  
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
  });

  //upload image
  router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)
module.exports=router;