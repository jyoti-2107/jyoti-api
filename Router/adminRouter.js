const Auth_check=require('../middle-ware/isAuth');
const express=require('express');
const admin_router=express.Router();

const admin_controller=require('../Controller/adminController');

// admin_router.get('/add_product',admin_controller.getAddProduct);
//to display the form to add product

admin_router.post('/addData',admin_controller.postData);
//to post value of the form --/addData this path name is given by us 

admin_router.get('/View_Product',admin_controller.getProductDetails);
// admin_router.get('/edit_form/:e_id',admin_controller.getEditData);

admin_router.put('/editData/:prod_id',admin_controller.postEditData);

admin_router.delete('/delete_data/:d_id',admin_controller.getDelete);
// only for get method we are sending id

// admin_router.post('/delete_post',admin_controller.postDelete);


module.exports=admin_router;