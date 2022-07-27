exports.getHomePage=(req,res)=>{
    res.render('Common/home',{
        titlePage:"Home",
        path:'/'
    })
}