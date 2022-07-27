require('dotenv').config();

const express=require('express');
const appServer=express();

const cors=require('cors');

const mongoose=require('mongoose');

const session=require('express-session')
const mongodb_session=require('connect-mongodb-session')(session);

const path=require('path')

const multer=require('multer')

const bcrypt=require('bcryptjs');

const authModel=require('./Model/authModel')

const flash=require('connect-flash');

// const csurf=require('csurf');

const cookieParser=require('cookie-parser');



const form_routing=require('./Router/adminRouter');
const user_routing=require('./Router/userRouter');
const auth_router=require('./Router/authRouter');
const dash_router=require('./Router/dashRouter');
const common_router=require('./Router/commonRouter');

// const mongoConnect=require('./Database/db').mongoConnect;

// const csurfProtection=csurf();
// const dbDriver="mongodb+srv://jr_2107:jr210792@cluster0.ojfv5.mongodb.net/Api_Project?retryWrites=true&w=majority"


appServer.use(express.urlencoded());





appServer.use(flash());
appServer.use(cookieParser());




const session_store=new mongodb_session({
    uri:'mongodb+srv://jr_2107:jr210792@cluster0.ojfv5.mongodb.net/Api_Project',
    collection:'user-session'
})


appServer.use(session({secret:'secret-key',resave:false,saveUninitialized:false,store:session_store}))

appServer.use(express.static(path.join(__dirname,'Public')))

appServer.use('/Uploaded_images',express.static(path.join(__dirname,'Uploaded_images')))
// to store images

// to use the images folder after adding it to database
// fileStorage is user-defined term
// diskStorage(pre-defined)-Returns a StorageEngine implementation configured to store files on the local file system.
const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'Uploaded_images')
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)    
        // originalname is pre-defined
    }
});

const fileFilter=(req,file,callback)=>{
    if(file.mimetype.includes("png")||file.mimetype.includes("jpg")||file.mimetype.includes("jpeg")||file.mimetype.includes("webP"))
    {
        callback(null,true)
    }
    else{
        callback(null,false)
    }
}

appServer.use(multer({storage:fileStorage,fileFilter,limits:{fieldSize:1024*1024*5}}).single('image'));

appServer.set('view engine','ejs');
appServer.set('views','View');


appServer.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');

    next();
})

appServer.use(cors());

appServer.use((req,res,next)=>{
    if(!req.session.user)
    {
      return next();  
    }
    authModel.findById(req.session.user._id).then(userValue=>{
        req.user=userValue;
        // console.log("User Detail:",req.usere);
        next();
    }).catch(err=>{
         console.log("User Not Found",err)
    })
})

// appServer.use(csurfProtection);

// appServer.use((req,res,next)=>{
//     res.locals.isAuthenticated=req.session.isLoggedIn;
//     res.locals.csrf_token=req.csrfToken();
//     next();
// })

appServer.use(form_routing);
appServer.use(user_routing);
appServer.use(auth_router);
appServer.use(dash_router);
appServer.use(common_router);

appServer.use((req,res)=>{
    res.send('<h1>PAGE NOT FOUND! Please recheck.</h1>')
})


// appServer.use(function(req,res){
//     res.render('Common/PNF',{
//         titlePage:"error",
//         status: 404,
//         url: req.url,
//         path: ''
//     })
// })



mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    // console.log("Database Connected");
    appServer.listen(process.env.PORT,()=>{
        console.log("Server is connected at localhost 5678");
    })
}).catch(err=>{
    console.log("Database is not connected",err);
})
