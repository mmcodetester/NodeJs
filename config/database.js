const mongoose=require('mongoose');
const url='mongodb+srv://@cluster0.qta2d.mongodb.net/'
mongoose.connect(
  url,{
          dbName:'pan-taing',
          user:'admin',
          pass: 'admin',
          useNewUrlParser: true,
          useUnifiedTopology:true,
          useFindAndModify: false
}).then(()=>{
    console.log('mongose connect')
}).catch(err=>console.log(err.message));

mongoose.connection.on('connected',(err)=>{
    console.log('connected to db');
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message);
})
mongoose.connection.on('disconnect',(err)=>{
    console.log(err.message);
})
process.on('SIGINT',()=>{
    mongoose.connection.close(()=>{
        console.log('mongose disconnect due to app terminated..........');
    })
    process.exit(0);
})
module.exports=mongoose;
