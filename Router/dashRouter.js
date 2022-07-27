const express=require('express');
const dash_router=express.Router();
const dash_controller=require('../Controller/dashController');

dash_router.get('/profile',dash_controller.getProfile);
dash_router.get('/logout',dash_controller.logOut);


module.exports=dash_router;