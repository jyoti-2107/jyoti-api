const AuthModel=require('../Model/authModel');

exports.getProfile=(req,res)=>{
const user_id=req.user._id;
console.log("Collected Id:",user_id);
AuthModel.findById(user_id).then(result=>{
    res.render('authentication/dashboard',{
        titlePage:"details",
        data:result,
        path:'/profile'
    })
}).catch(err=>{
    console.log("Dashboard Error",err);
})
}

exports.logOut=(req,res)=>{
req.session.destroy();
res.redirect('/loginForm');
}