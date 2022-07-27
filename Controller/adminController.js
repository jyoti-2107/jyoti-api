// const dataArray=[];

const ProductModel=require('../Model/product');
const path=require('path');


// exports.getAddProduct=(req,res)=>{
//     res.render('Admin/Add_Product',{
//         titlePage:"add product",
//         path:'/add_product'
//     })
// }

exports.postData=(req,res)=>{
    console.log("Collected values from Add Product: ",req.body);
    let title=req.body.ptitle;
    let price=req.body.pprice;
    let pimage=req.file;
    let pImage_url=pimage.path;
    
    // let img_url=req.file.path;

    let desc=req.body.pdesc;

    //we are collecting values in title,price,desc 
    if(!title)
    {
        return res.status(401).json({
            success:false,
            message:"Product Title Is Required"
        })
    }
    else if(!price)
    {
        return res.status(401).json({
            success:false,
            message:"Price Is Required"
        })
    }
    else if(!pImage_url)
    {
        return res.status(401).json({
            success:false,
            message:"Product image Is Required"
        })
    }
    else if(!desc)
    {
        return res.status(401).json({
            success:false,
            message:"Description Is Required"
        })
    }
    else
    {
        const product_data=new ProductModel({ptitle:title,pprice:price,pdesc:desc,pimage:pImage_url});
    // ptitle,pprice,pdesc key names are from Model
    product_data.save()
    .then(results=>{
        return res.status(200).json({
            success:true,
            message:"Product Added Successfully",
            result:results

        })
       
    }).catch(err=>{
        return res.status(401).json({
            success:false,
            message:err
        })
    })
    
    }
}

exports.getProductDetails=(req,res)=>{
    ProductModel.find().sort({pprice:1}).then(products=>{
        // console.log("fetched product",products)
        // we use find() for simply fetching data
        return res.status(201).json({
            success:true,
            message:"Product Fetched Successfully",
            result:products
        })
    }).catch(err=>{
        return res.status(401).json({
            success:false,
            message:"Product Fetching Failed",
        })
    })
}

// exports.getEditData=(req,res)=>{
//     let editId=req.params.e_id;
//     // console.log("Edit Id:",editId);
//     ProductModel.findById(editId)
//     // we use findById() for a particular data
//     .then(eForm=>{
//         res.render('Admin/edit_form',{
//             titlePage:"Edit Page",
//             data:eForm,
//             path:'/edit_form/:e_id'
//         })
//     }).catch(err=>{
//         console.log("Form Not Found",err);
//     })
// }

exports.postEditData=(req,res)=>{
     const updated_ptitle=req.body.ptitle;
     const updated_pprice=req.body.pprice;
     const updated_pdesc=req.body.pdesc;
     const prodId=req.params.prod_id;
     const new_Url=req.file;
     const old_Url=req.body.oldUrl;
     let imageUrl;

     

     if(!updated_ptitle)
    {
        return res.status(401).json({
            success:false,
            message:"Product Title Is Required"
        })
    }
    else if(!updated_pprice)
    {
        return res.status(401).json({
            success:false,
            message:"Price Is Required"
        })
    }
    
    else if(!updated_pdesc)
    {
        return res.status(401).json({
            success:false,
            message:"Description Is Required"
        })
    }


     ProductModel.findById(prodId).then(productsData=>{
        productsData.ptitle=updated_ptitle;
        productsData.pprice=updated_pprice;
        productsData.pdesc=updated_pdesc;
        if(new_Url===undefined)
        {
          imageUrl=old_Url; 
        }
        else{
           imageUrl=new_Url.path;
        }
        // ptitle,pprice,pdesc these fields are from Model section

        return productsData.save()
        .then(results=>{
           return res.status(200).json({
            success:true,
            message:"Product Updated Successfully",
            result:results
           })      
     })
    }).catch(err=>{
             return res.status(401).json({
                success:false,
                message:"Product Not Updated",
             })
    
     })
}

exports.getDelete=(req,res)=>{
    let deleteId=req.params.d_id;
    // console.log("Delete Id:",deleteId);
    ProductModel.deleteOne({_id:deleteId})
    .then(results=>{
        return res.status(200).json({
            success:true,
            message:"Product Deleted Successfully",
            
        })
    })
    .catch(err=>{
       return res.status(401).json({
        success:false,
        message:"Product Deletion Failed"
       })
    })
}

// exports.postDelete=(req,res)=>{
//     let deleteId=req.body.DELETE_id;
//     console.log("Delete Id:",deleteId);
//     ProductModel.deleteOne({_id:deleteId})
//     .then(results=>{
//         console.log("Deleted Successfully",results);
//         res.redirect('/View_Product');
//     })
//     .catch(err=>{
//         console.log("Error to delete",err);
//     })
// }



