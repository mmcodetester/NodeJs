const express=require('express');
var port = process.env.PORT ||3000;
const path = require('path');
const exphbs=require('express-handlebars');
const app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(port,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("server is listen at http://localhost:"+`${port}`);
    }
})
