const express=require('express');
var port = process.env.PORT ||3000;
const bodyParser = require('body-parser');
const User = require('./model/userModel');
require('./config/database');
const path = require('path');
const exphbs=require('express-handlebars');
const app = express();
app.use(bodyParser.json());
//app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async(req,res)=>{
   await User.findOne({name: req.body.name}).then((result)=>{
       if(result.password==req.body.password){
           res.render('dashboard');
       }
       else{
           res.redirect('/login');
       }
   })
})

app.listen(port,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("server is listen at http://localhost:"+`${port}`);
    }
})
