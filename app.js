const express=require('express');
var port = process.env.PORT ||3000;
const bodyParser = require('body-parser');
const User = require('./model/userModel');
const Post=require('./model/postsModel');
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
app.get('/',async(req,res)=>{
   const data=await Post.find();
   console.log(data);
    if(data){
        res.render('index',{
            results: data
          });
    }
    
})

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

app.get('/:id', (req, res) => {
    const id=req.params.id;
    res.render('dashboard')
})

app.get('/user/post',async(req,res)=>{
    await Post.find().then((result) => {
        res.render('post',{result: result});
    })
    
})

app.post('/user/post/upload',upload.single('profile'), async (req, res)=> {
    message : "Error! in image upload."
      if (!req.file) {
          console.log("No file received");
            message = "Error! in image upload."
          res.render('index',{message: message, status:'danger'});
      
        } else {
          console.log('file received');
          console.log(req.file.filename);
            const post=new Post({
                title:req.body.title,
                body:req.body.body,
                image:req.file.filename
            });
            await post.save().then((data) => {
                if(data){
                    req.redirect('/user/posts');
                }
            })
        }
  });

app.listen(port,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("server is listen at http://localhost:"+`${port}`);
    }
})
