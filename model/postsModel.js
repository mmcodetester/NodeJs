const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PostSchema=new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});
const Post=mongoose.model('post',PostSchema);
module.exports=Post;