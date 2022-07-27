const express=require('express');
const common_router=express.Router();

const common_controller=require('../Controller/commonController');

common_router.get('/',common_controller.getHomePage);

module.exports=common_router;