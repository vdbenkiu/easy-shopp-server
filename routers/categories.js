const {Categories}=require('../models/category');
const express =require('express');
const router=express.Router();

router.get('/',async (req,res)=>{
    const categoriesList=await Categories.find();
    
    if(!categoriesList){
        res.status(500).json({success: false})
    }
    res.send(categoriesList);
})
router.post('/',async(req,res)=>{
    let categories=new Categories({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    categories=await categories.save();

    if(!categories)
    return res.status(404).send('the category cannot be created!')
    res.send(categories);
    })

    router.get('/:id',async(req,res)=>{
        const categories=await Categories.findById(req.params.id);
        if(!categories){
            res.status(500).json({message:'the category with the given ID war not found.'})
        }
        res.status(200).send(categories);
    })
    router.put('/:id',async (req,res)=>{
        const categories=await Categories.findByIdAndUpdate(
            req.params.id,
            {
                name:req.body.name,
                icon:req.body.icon,
                color:req.body.color,
            },
            { new:true}
        )
        if(!categories)
        return res.status(404).send('the category cannot be created!')
        res.send(categories);
    })
    
    router.delete('/:id',(req,res)=>{
        Categories.findByIdAndRemove(req.params.id).then(categories=>{
            if(categories){
                return res.status(200).json({success:true,message:'the category is delete!'})
            }else{
                return res.status(404).json({success: false,message:'the category not found!'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false,error:err})
        })
    })
    
module.exports=router;