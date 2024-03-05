const mongoose=require('mongoose');


const userSchema= mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
   },
   title:String,
   desc:String,
   img:String
});


module.exports=mongoose.model("post",userSchema)