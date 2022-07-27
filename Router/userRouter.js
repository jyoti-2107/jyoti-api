const express=require('express');
const user_router=express.Router();

const user_controller=require('../Controller/userController');
const Auth_check=require('../middle-ware/isAuth');

user_router.get('/userProductView',user_controller.getProduct);
user_router.get('/singleProduct/:u_view_id',user_controller.getSingleDetail);
// user_router.get('/productdetails',user_controller.get_ProductDetails);
user_router.post('/search_Id',user_controller.postSearchData);
user_router.post('/addtocart',Auth_check,user_controller.postAddToCart);
user_router.get('/display',user_controller.getDisplay);
user_router.post('/deleteCartItem',user_controller.postDeleteItem);
user_router.get('/checkout',user_controller.getcheckout);


module.exports=user_router;