const path=require('path');
const ProductModel=require('../Model/product');
const CartModel=require('../Model/cart');

exports.getProduct=(req,res)=>{
    ProductModel.find().sort({pprice:1}).then(product=>{
       res.render('User/userProductView',{
            titlePage:"product details",
            data:product,
            path:'/userProductView'
        })
    }).catch(err=>{
        console.log("err")
    })
}

exports.getSingleDetail=(req,res)=>{
    const product_id=req.params.u_view_id;
    console.log("Product Id is: ",product_id);
    ProductModel.findById(product_id).then(product=>{
        res.render('User/productdetails',{
            titlePage:"Product Details",
            data:product,
            path:'/singleProduct/:u_view_id'
        })
    }).catch(err=>{
        console.log("Product not found",err);
    })
}

// exports.get_ProductDetails=(req,res)=>{
//     ProductModel.fetchData().then(products=>{
//         console.log("Product Details",products)
//         res.render('User/productdetails',{
//             titlePage:"Product Details",
//             data:products
//         })
//     }).catch(err=>{
//         console.log("No such product found",err);
//     })
// }

exports.postSearchData=(req,res)=>{
    let serach_form=req.body.serach_text;
    console.log("Searched Data Is:",serach_form);
    ProductModel.find({ptitle:serach_form})
    // find() is predefined function of mongoose
    .then(products=>{
        console.log("After Searching:",products);
        res.render('User/userProductView',{
        titlePage:"Search Form",
        data:products,
        path:'/search_Id'
        })
    }).catch(err=>{
        console.log("No such data",err);
    })
}

exports.postAddToCart=(req,res)=>{
    const pId=req.body.productId;
    const quantity=req.body.quantity;
    const userId=req.user._id;
    console.log("After add to cart: Pid:",pId,"Q: ",quantity,"Id: ",userId);
    
   const cartValue=[];
   CartModel.find({userId:userId,productId:pId})
   .then(cartData=>{
    console.log("cartData:",cartData);
    if(cartData=='')
    {
        ProductModel.findById(pId)
        .then(productForCart=>{
            console.log("Product For Cart", productForCart);
            cartValue.push(productForCart);
            const cartProduct=new CartModel({productId:pId,quantity:quantity,userId:userId,cart:cartValue});
            cartProduct.save()
            .then(result=>{
                console.log("Product added into cart successfully");
                res.redirect('/display');
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    }
    else
    {
cartData[0].quantity=cartData[0].quantity+1;
cartData[0].save()
.then(result=>{
    console.log('product again added in the cart successfully');
    res.redirect('/display');

}).catch(err=>{
    console.log(err);
})
    }
   }).catch(err=>{
    console.log("Product can not be added ")
   })
}

exports.getDisplay=(req,res)=>{
    const user_Id=req.user._id;
    console.log("Cart",user_Id);
    CartModel.find({userId:user_Id}).then(productForCart=>{
console.log("Product For Cart:",productForCart);
        res.render('User/addToCart',{
             titlePage:"Display",
             data:productForCart,
             path:'/display'
         })
     }).catch(err=>{
         console.log("err")
     })
}

exports.postDeleteItem=(req,res)=>{
    let DeleteId=req.body.delete_id;
    console.log("Delete Id:",DeleteId);
    CartModel.deleteOne({_id:DeleteId})
    .then(results=>{
        console.log("Deleted Successfully",results);
        res.redirect('/display');
    })
    .catch(err=>{
        console.log("Error to delete",err);
    })
}

exports.getcheckout=(req,res)=>{
    res.render('User/checkout',{
        titlePage:"checkout",
        path:'/checkout'
    })
}
