const mongoose=require('mongoose')

const categoriesSchema=mongoose.Schema({
   name:{
       type:String,
       require:true,
   },
   icon:{
       type:String,
   },
   color:{
       type:String,
   },
})
exports.Categories=mongoose.model('Categories',categoriesSchema);