const mongoose=require('mongoose');
const SchemaVariable=mongoose.Schema
// Schema is predefined

const ProductSchema=new SchemaVariable({
    ptitle:{
        type:String,
        required:true

    },
    pprice:{
        type:Number,
        required:true

    },
    pdesc:{
        type:String,
        required:true

    },
    pimage:{
        type:String,
        required:true
    }
})
// ptitle,pprice,pdesc are the key names

module.exports=mongoose.model('products',ProductSchema)
//mongoose.model('collection name',schema name)



