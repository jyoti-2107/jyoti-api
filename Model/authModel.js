const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema

const UserSchema=new SchemaVariable({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pwd:{
        type:String,
        required:true
    },
    isVerified:{
        type: Boolean,
        default: false
    }
   
})

module.exports=mongoose.model('User',UserSchema)
// collection name should be different from other Models
// Model key names are taken by us