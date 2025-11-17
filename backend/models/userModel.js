import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    firstName: { type: String,required:true},
    lastName: { type: String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:{type:String, default:'000000000'},
    omiljeniSaloni: [{type:mongoose.Schema.Types.ObjectId,ref:'salon'}]
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel