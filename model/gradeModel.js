const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const GradeSchema=new Schema({
    name:{
        type: String,
        require: true,
    },
    created:{
        type: Date, 
        required: true, 
        default: Date.now 
    },
    delete:{
        type: Number,
    }
})

const Grade=mongoose.model('Grade',GradeSchema);
module.exports=Grade;