const express=require('express');
var port = process.env.PORT ||3000;
const bodyParser = require('body-parser');
const User = require('./model/userModel');
const Post=require('./model/postsModel');
const Grade = require('./model/gradeModel');
const Student = require('./model/studentModel');
require('./config/database');
const path = require('path');
const hbs=require('express-handlebars');
const app = express();
const multer=require('multer');
app.use(bodyParser.json());
//app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.engine('handlebars', hbs({
    defaultLayout: 'main',runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,

    }
}));

app.set('view engine', 'handlebars');
app.use('/static', express.static(path.join(__dirname, 'public')))

const DIR = './public/uploads';
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
 
let upload = multer({storage: storage});

//**************||************************POST GET ALL VIEW************************************||*****************\\
app.get('/',async(req,res)=>{
   const data=await Post.find().sort({date:-1});
   //console.log(data);
    if(data){
        res.render('index',{
            results: data
          });
    }
    
})
app.get('/api',async(req,res)=>{
    const data=await Post.find().sort({date:-1});
    //console.log(data);
     if(data){
       res.json(data);
     }
     
 })
//*****************||*******************************************Part of Login**************************************||*************\\
app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async(req,res)=>{
   await User.findOne({name: req.body.name}).then((result)=>{
       if(result.password==req.body.password){
           res.redirect(`/${result._id}`);
       }
       else{
           res.redirect('/login');
       }
   })
})

app.post('/api/login',async(req,res)=>{
    await User.findOne({name: req.body.name}).then((result)=>{
        if(result.password==req.body.password){
            res.json({
                message:"liogin success"
            });
        }
        else{
           res.json({
               message:"login fails"
           })
        }
    })
 })

app.get('/:id', (req, res) => {
    const id=req.params.id;
    res.render('dashboard')
})

//*************||********************************part of post**********************************||***************\\

app.get('/user/5f87e4443d9406180ccc1703/post',async(req,res)=>{
    await Post.find().sort({date:-1}).then((result) => {
        res.render('post',{result: result});
    })
    
})

app.post('/user/5f87e4443d9406180ccc1703/post',upload.single('profile'), async (req, res)=> {
    message : "Error! in image upload."
      if (!req.file) {
          //console.log("No file received");
            message = "Error! in image upload."
          res.render('index',{message: message, status:'danger'});
      
        } else {
         // console.log('file received');
         // console.log(req.file.filename);
            const post=new Post({
                title:req.body.title,
                body:req.body.body,
                image:req.file.filename
            });
            const resdata=await post.save();
            if(resdata){
                res.redirect('/user/5f87e4443d9406180ccc1703/post');
            }
        }
  });

  app.get('/user/5f87e4443d9406180ccc1703/post/delete/:id',async(req, res)=>{
      const id=req.params.id;
    await Post.findOneAndDelete({_id:id}).then((success)=>{
        if(success){
            res.redirect('/user/5f87e4443d9406180ccc1703/post');
        }
    })
  })

  //*****************||*******************************Part of Grade*******************************||******************\\

  app.get('/user/5f87e4443d9406180ccc1703/grade',async(req,res)=>{
      const data=await Grade.find({},{"__v":0});
      if(data){
          res.json(data);
      }
  });

  app.post('/api/user/grade',async(req,res)=>{
   const newGrade=new Grade({
       name:req.body.name, 
       delete:'0'
    })
    await newGrade.save().then((result)=>{
        if(result){
            res.json({
                message:'success insert',
                result:result
            })
        }
    })
});
  app.get('/api/user/grade',async(req,res)=>{
    const data=await Grade.find({},{"__v":0});
    if(data){
        res.json(data);
    }
});

app.get('/api/user/grade/:id',async(req,res)=>{
    await Grade.findOneAndDelete({_id:id}).then((success)=>{
        if(success){
            res.json({
                message:"delete success"
            })
        }
    })
});

//*************||**********************************Part of Student******************************||****************\\
  app.get('/user/5f87e4443d9406180ccc1703/student',async(req,res)=>{
    await Student.find({},{"__v":0}).populate('grade').exec((err,data)=>{
        //console.log(data);
        res.render('student',{result: data});
        });
    })

    app.get('/api/user/student',async(req,res)=>{
        await Student.find({},{"__v":0}).populate('grade').exec((err,data)=>{
            //console.log(data);
            res.render('student',{result: data});
            });
        })

    app.get('/user/5f87e4443d9406180ccc1703/student/new',async(req,res)=>{
        await Grade.find({},{"__id":0}).then((grade)=>{
            if(grade){
                //console.log(grade);
                res.render('newStudent',{result:grade});
            }
        })
    })

  app.post('/user/5f87e4443d9406180ccc1703/student/new',async(req,res)=>{
      const newStudent=new Student({
          name: req.body.name,
          dob:req.body.dob,
          fatherName:req.body.fatherName,
          motherName:req.body.motherName

      });
      try {
         // console.log(req.body.grade);
    await Grade.findOne({name:req.body.grade},{"__v":0}).then((data)=>{
        if(data){
            newStudent.grade.push(data);
           const dt= newStudent.save();
           if(dt){
            res.redirect('/user/5f87e4443d9406180ccc1703/student');
           }
        }
        else{
            const newGrade =new Grade({
                name:req.body.grade
            })
           const data=newGrade.save();
           if(data){
            newStudent.grade.push(data);
            newStudent.save().then((result)=>{
                res.redirect('/user/5f87e4443d9406180ccc1703/student');
            })
           }
        }
        })
      }catch(e) {
          console.log(e.message)
      }
    
})  
//************||*****************************server listen mode********************************||*****************\\ 
app.listen(port,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("server is listen at http://localhost:"+`${port}`);
    }
})
