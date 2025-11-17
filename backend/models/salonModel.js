import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    date: { type: Date, default: Date.now },
    radnikId: { type: mongoose.Schema.Types.ObjectId, ref: 'radnik', required: false }, // Referenca na radnika
    usluga: { type: [String], required: false }, // Referenca na uslugu

});

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: [String], required: true },
    ratings: [ratingSchema] ,
    komentar:{type:String, required:false},
    tip: { type: String, required: true },
    grad: { type: String, required: true },
    usluge: [
        {
            usluga: { type: String, required: true },
            podtip: { type: [String], required: true },
            cena: { type: [Number], required: true }
        }
    ],
    informacije: { type: String, required: true },
    zaposleni: [ { type: mongoose.Schema.Types.ObjectId, ref: 'radnik',default: [] } ],
    radnoVreme: [
        {
            dan: { type: String, required: true },
            vreme: { type: String, required: true }
        }
    ],
    mapUrl: { type: String, required: true },
    link: { type: String, required: false }
}, { minimize: false });

const salonModel = mongoose.models.salon || mongoose.model('salon', salonSchema);

export default salonModel