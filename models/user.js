const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        default:true},
    passwordHash:{
        type:String,
        default:true},
    phone:{
        type:String,
        default:true
    },
    isAdmin:{
        type:String,
        default:false},
    street:{
        type:String,
        default:''
    },
    zip:{
        type:String,
        default:''},
    city:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    }
})
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
userSchema.set('toJSON',{
    virtuals:true,
});
exports.User=mongoose.model('User',userSchema);
