const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const StudentSchema=new Schema({
    name:{
        type: String,
        required: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    fatherName:{
        type: String,
        required: true,
    },
    motherName:{
        type: String,
        required: true,
    },
    grade:[{type: mongoose.Schema.Types.ObjectId, ref: 'Grade'}]
      
})

const Student =mongoose.model('student',StudentSchema);

module.exports =Student;