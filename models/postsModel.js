const mongoose = required("mongoose")
const postSchema = new mongoose.Schema(
    {
        title:
        {
            type:String,required:["true","title is requried"],
            trim:true
        },
        description:
        {
            type:String,required:["true","description is requried"],
            trim:true
        },
        userId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
        //type: mongoose.Schema.Types.ObjectId:
// This says that the field holds a MongoDB _id (like 64ef00a9a2c3b7...)
// ref: "User":
// This references the User model — so Mongoose knows which collection to look in when you use .populate().

    },
    {timstamps:true}
)
module.exports = mongoose.schema("Post",postSchema);