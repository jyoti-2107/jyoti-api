const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema
// Schema is predefined

const TokenSchema=new SchemaVariable({
    _userId:{
        type: SchemaVariable.Types.ObjectId,
        required:true,
        ref:'User'
        // the ref option is what tells mongoose which model to use during population(reference of other model)
    },
    token:{
        type:String,
        required:true
    }
})


const TokenModel=new mongoose.model("token",TokenSchema)
module.exports=TokenModel;