import salonModel from "../models/salonModel.js";
import radnikModel from "../models/radnikModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import terminModel from "../models/terminModel.js";

const addSalon = async (req, res) => {
    try {
        const {
            name,
            ocena,
            tip,
            grad,
            informacije,
            mapUrl,
            link
        } = req.body;
        const imageUrls = req.files ? await Promise.all(req.files.map(async (file) => {
            const uploadedImage = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
            return uploadedImage.secure_url; 
        })) : [];

        const zaposleni = Array.isArray(req.body.zaposleni) ? req.body.zaposleni : JSON.parse(req.body.zaposleni);
        const usluge = Array.isArray(req.body.usluge) ? req.body.usluge : JSON.parse(req.body.usluge);
        const radnoVreme = Array.isArray(req.body.radnoVreme) ? req.body.radnoVreme : JSON.parse(req.body.radnoVreme);


        console.log(req.body);
        console.log(imageUrls);


        if (!name || !tip || !grad || !informacije || !zaposleni || !radnoVreme || !mapUrl) {
            return res.json({ success: false, message: "missing details!" })
        }

        

        const newSalon = new salonModel({
            name,
            image: imageUrls,
            ocena,
            tip,
            grad,
            usluge, 
            informacije,
            zaposleni, 
            radnoVreme, 
            mapUrl,
            link
        });

        await newSalon.save();

        res.json({ success: true, message: "Salon je dodat!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Nevalidni podaci!" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });

    }
}

const addRadnik = async (req, res) => {
    try {
        const { ime, prezime, password, email, salonId } = req.body
        console.log(req.body);

        if (!ime || !prezime || !password || !salonId) {
            return res.status(400).json({ message: "Svi podaci su obavezni!" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Unesite ispravan mail" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const salon = await salonModel.findById(salonId);
        if (!salon) {
            return res.status(404).json({ message: "Salon nije pronađen!" });
        }

        const newRadnik = new radnikModel({
            ime,
            prezime,
            password: hashedPassword,
            email,
            salonId
        })

        await newRadnik.save()
        if (salon && salon.zaposleni) {
            salon.zaposleni.push(newRadnik._id);
        } else {
            console.error("Salon ili zaposleni niz nije pronađen.");
        }

        await salon.save();

        res.json({ success: true, message: "Radnik je uspesno dodat" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addRadnikSalon = async (req, res) => {
    try {

        const { ime, prezime, password, email } = req.body
        console.log(req.body);

        if (!ime || !prezime || !password || !email) {
            return res.json({ message: "Svi podaci su obavezni!" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Unesite ispravan mail" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newRadnik = new radnikModel({
            ime,
            prezime,
            password: hashedPassword,
            email
        })

        await newRadnik.save()


        res.json({ success: true, message: "Radnik je uspesno dodat!", radnik: newRadnik, id: newRadnik._id })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });

    }
}

const allSalons = async (req, res) => {
    try {
        const salons = await salonModel.find({})
        res.json({ success: true, salons })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const listaTerminaAdmin = async (req, res) => {
    try {
        const termini = await terminModel.find({})
        console.log("Preuzeti termini:", termini);
        res.json({ success: true, termini })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminDashboard = async (req, res) => {
    try {
        const { salonId } = req.query;
        const salon = await salonModel.findById(salonId).populate('usluge zaposleni')

       // const termini = await terminModel.countDocuments({ naziv: salon.name })
        const terminSalon=await terminModel.find({naziv:salon.name})
        const najpopularnijaUsluga = terminSalon
        .map(termin => termin.usluga)
        .flat()
        .sort((a, b) => b.someField - a.someField)
        .shift(); 

        console.log(najpopularnijaUsluga);
        
        const brojRecenzija = salon.ratings?.length || 0;
        let earnings=0
        const now = new Date();
        const month=now.getMonth()
        const year=now.getFullYear()
        terminSalon.forEach((item)=>{
            if(item.isCompleted){
                const itemDate=new Date(item.date)
                if (itemDate.getMonth() === month && itemDate.getFullYear() === year) {
                    if (Array.isArray(item.cena)) {
                        earnings += item.cena.reduce((sum, value) => sum + value, 0);
                    }  
                }
            }
        })
        const stats = {
            _id: salon._id,
            zaposleni:salon.zaposleni,
            termini: terminSalon.length,
            najpopularnijaUsluga,
            brojRecenzija,
            earnings
        }
               
        
        


        res.json({ success: true, stats })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const deleteSalon = async (req, res) => {
    try {
        const { salonId } = req.params
        await salonModel.findByIdAndDelete(salonId)
        res.json({ success: true, message: 'Salon je obrisan!' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const deleteRadnik = async (req, res) => {
    try {
        const { radnikId } = req.params;

        const radnik = await radnikModel.findById(radnikId);
        if (!radnik) {
            return res.status(404).json({ success: false, message: "Radnik nije pronađen" });
        }

        await salonModel.updateOne(
            { zaposleni: radnikId }, 
            { $pull: { zaposleni: radnikId } } 
        );

        await radnikModel.findByIdAndDelete(radnikId);

        res.json({ success: true, message: "Radnik obrisan" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addSalon, loginAdmin, addRadnik, adminDashboard, addRadnikSalon, allSalons, listaTerminaAdmin, deleteSalon,deleteRadnik }