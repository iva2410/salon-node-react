import mongoose from "mongoose";


const radnikSchema=new mongoose.Schema({
    ime:{type:String,required:true},
    prezime: {type:String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'salons', required: false },
    slots_booked: { type: Object, default: {} }
})

const radnikModel =mongoose.models.radnik || mongoose.model('radnik', radnikSchema);
export default radnikModel