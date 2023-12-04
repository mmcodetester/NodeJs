const express=require('express');
var port = process.env.PORT ||3000;
const app = express();
app.get('/',async(req,res)=>{
   var data = [
    {'id':1,'name':'Alexander'},
    {'id':2,'name':'William'}
   ]
    res.json(data);
})
app.listen(port,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("server is listen at http://localhost:"+`${port}`);
    }
})
