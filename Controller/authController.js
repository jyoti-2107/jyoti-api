const RegLoginModel=require('../Model/authModel');
const TokenModel=require('../Model/TokenModel');
const jwt=require('jsonwebtoken');
const bcrypt=require("bcryptjs");
const path=require('path');
const {validationResult}=require('express-validator');
//we are using curly braces for object destructuring method

const nodemailer=require('nodemailer');
const authModel = require('../Model/authModel');
const transporter=nodemailer.createTransport({
host:"smtp",
port:1000,
secure:false,
requireTLS:true,
service:'gmail',
auth:{
    user:'jroy080320@gmail.com',
    pass:'kofffpiyydlcmzit'
}
})


// exports.getRegData=(req,res)=>{
//     let message=req.flash("error");
//     console.log(message);
//     if(message.length>0){
//         message=message[0];
//     }
//     else{
//         message=null;
//     }
//    res.render('authentication/reg',{
//         titlePage:"Registration",
//         path:'/registration',
//         errorMsg: message,
//         error:[],
//     })
// }



exports.postRegData=(req,res)=>{
    console.log("Collected values from Registration Form: ",req.body);
    let Fname=req.body.fname;
    let Lname=req.body.lname;
    let Email=req.body.email;
    let PWD=req.body.pwd;

    let error = validationResult(req);

    if(!error.isEmpty())
    {
        errorResponse= validationResult(req).array();
        console.log(errorResponse);
        res.render("authentication/reg",
        {
            titlePage: "Registration Form",
            path: "/registration",
            errorMsg:"",
            error:errorResponse,
        })
    }
   else
   {
     // RegLoginModel.findOne({$or: [{email:Email},{firstName:Fname}]})
     RegLoginModel.findOne({email:Email})
     .then(userValue=>{
         if(userValue)
         {
             // console.log(userValue,"Email already exist");
             req.flash("error","Error::Email already exist");
             return res.redirect('/registration');
         }
         return bcrypt.hash(PWD,12)
         .then(hashPassword=>{
             const userData=new RegLoginModel({fname:Fname,lname:Lname,email:Email,pwd:hashPassword})
             // RegLoginModel(Model key name: controller key name)
             return userData.save((err,user)=>{
                if(!err){
                    const token_jwt=jwt.sign({email:Email},"secretkeyisatwebskittersandwebskittersisatsecretkey",{expiresIn:'1h'});
                    const Token_data=new TokenModel({
                        token:token_jwt,
                        _userId:user._id
                    })
                    Token_data.save()
                    .then(result=>{
                        console.log('Registration done')
                        
                        let mailOptions={
                           from:'jroy080320@gmail.com',
                            to:user.email,
                            subject:"Email Verification",
                            text:'Hello '+Fname+', \n\nYour registration has been done,please verify the account by clicking on the link:\nhttp:\/\/'+req.headers.host
                            +'\/mail_confirmation\/'+ user.email+'\/'+token_jwt+'\n\nThank You!\n'
                        }
                       transporter.sendMail(mailOptions,function(error,successInfo)
                       {
                            if(error)
                            {
                                console.log("Error to send mail",error);
                            }
                            else{
                                console.log("Mail sent",successInfo);
                                res.redirect('/');
                            }
                        })
                        // return res.redirect('/loginForm');
                        // res.end();
                    }).catch(err=>{
                        console.log("Error to save registered Data",err);
                    })
                }
                else
                {
                  console.log("Error to save Token",err)
                }
             })
         })
     }).catch(err=>{
         console.log("Error in findOne",err)
     })
 }
   }

// exports.getLoginForm=(req,res)=>{
//     let message=req.flash("error");
//     console.log(message);
//     if(message.length>0){
//         message=message[0];
//     }
//     else{
//         message=null;
//     }
//     res.render('authentication/login',{
//         titlePage:"Login Page",
//         path:'/loginForm',
//         errorMsg:message
//     })
// }

exports.postLoginData=(req,res)=>{
     const uemail=req.body.email;
     const upassword=req.body.pwd;
console.log("Collected values from Login Form: ",req.body);
 RegLoginModel.findOne({email:uemail})
//  findOne({model name:collection name})
.then((userValue)=>{
    console.log(userValue)
    if(userValue){
        if(!userValue.isVerified){
            req.flash('error','User is not verified');
            console.log("User is not verified");
            return res.redirect('/loginForm');
        }
    else
    {
        bcrypt
        .compare(upassword,userValue.pwd)
        .then((result)=>{
            console.log(result);
            if (!result){
                req.flash("error","Error::Invalid Password");
                console.log("Invalid Password");
            
                res.redirect('/loginForm');
            }
            else{
                console.log("logged in",result);
                req.session.isLoggedIn= true;
                req.session.user=userValue;
                return req.session.save((err)=>{
                    if(err)
                    {
                        console.log("Error to login",err);
                      
                    }
                    else{
                        console.log("Logged In");
                        return res.redirect('/');
                    }
                })
            }
        }).catch((err)=>{
            console.log("Error in comparison",err);
            res.redirect('/loginForm');
        })
    }
}
else 
    {
        
        req.flash("error","Error::Invalid Email");
        console.log("Invalid Email");
        return res.redirect('/loginForm');
    }
}).catch((err)=>{
    req.flash("error","Error::Invalid Email");
    console.log("Error to find email",err);
    return res.redirect('/loginForm');
})
}

exports.getLogOut=(req,res)=>{
    req.session.destroy();
    res.redirect('/add_product');
}

exports.confirmation=(req,res)=>{
    TokenModel.findOne({token:req.params.token})
    .then(result=>{
        console.log(result,"result of token findone");
        if(!result){
            console.log("Verification link may be expired :(");
        }
        else
        {
            authModel.findOne({_id:result._userId,email:req.params.email})
            .then(user_data=>{
                if(user_data.isVerified)
                {
                    console.log("user already verified")
                    // console.log('msg','User already verified');
                    res.redirect('/loginForm');
                }
                else
                {
                  user_data.isVerified=true;
                  user_data.save()
                  .then(result=>{
                    console.log("Your account is successfully verified");
                    res.redirect('/loginForm');
                  }).catch(err=>{
                    console.log("Something went wrong..",err);
                  })
                }
            })
        }
    }).catch(err=>{
        console.log("error to find token in database",err);
    })
}