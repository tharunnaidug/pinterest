const mongoose=require('mongoose');
const plm=require("passport-local-mongoose")

mongoose.connect("mongodb+srv://welcometokannada2017:pintresr@cluster0.mwd2sov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const userSchema= mongoose.Schema({
   username:String,
   email:String,
   password:String,
   profileimg:String,
   name:String,
   boards:[],
   posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
   }]
});

userSchema.plugin(plm)
module.exports=mongoose.model("user",userSchema)