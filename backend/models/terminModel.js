import mongoose from "mongoose"

const terminSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    radnikId: { type: String, required: true },
    usluga: { type: [String], required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    naziv: { type: String, required: false },
    radnikData: { type: Object, required: true },
    cena: { type: [Number], required: true },
    date: { type: Number, required: true },
    cancel: { type: Boolean, required: false },
    isCompleted: { type: Boolean, required: false },
    isConfirmed: { type: Boolean, required: false },
    hasReview: { type: Boolean, default: false }

})


const terminModel = mongoose.models.termin || mongoose.model('termin', terminSchema)
export default terminModel