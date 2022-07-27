const express=require('express');
const {check,body}=require('express-validator');
const auth_router=express.Router();

const auth_controller=require('../Controller/authController');

// auth_router.get('/registration',auth_controller.getRegData);

auth_router.post('/regData',
[
    body('fname','Valid First name').isLength({min:3,max:12}),
    body('lname','Valid Last name').isLength({min:3,max:12}),
    check('email').isEmail().withMessage("input valid email"),
    body('pwd','wrong pattern').matches('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*]).{4,12}$')
],
auth_controller.postRegData);

auth_router.get('/mail_confirmation/:email/:token',auth_controller.confirmation);

// auth_router.get('/loginForm',auth_controller.getLoginForm);
auth_router.post('/loginData',auth_controller.postLoginData);
// auth_router.get('/logout',auth_controller.getLogOut);






module.exports=auth_router;