import radnikModel from "../models/radnikModel.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import terminModel from "../models/terminModel.js"
import salonModel from "../models/salonModel.js"
import userModel from "../models/userModel.js"
const lista = async (req, res) => {
    try {
        const radnici = await radnikModel.find({}).select(['-password','-email'])

        res.json({ success: true, radnici })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//login
const loginRadnik=async(req,res)=>{
    try {
        const {email,password}=req.body
        const radnik=await radnikModel.findOne({email})

        if(!radnik){
            return res.json({ success: false, message: 'Nevalidni podaci!' })
        }

        const isMatch=await bcrypt.compare(password,radnik.password)
        if(isMatch){
            const token=jwt.sign({id:radnik._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            return res.json({ success: false, message: 'Nevalidni podaci!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const listaTerminaRadnik=async(req,res)=>{
    try {
        const {radnikId}=req.body
        const termini=await terminModel.find({radnikId})
        res.json({success:true, termini})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message }) 
    }
}

const otkazivanjeTermina = async (req,res)=>{
    try {
        const {radnikId,terminId}=req.body
        const terminData=await terminModel.findById(terminId)
        if(terminData && terminData.radnikId===radnikId){
            await terminModel.findByIdAndUpdate(terminId,{cancel:true})
            return res.json({ success: true, message: 'Termin otkazan' })
        } else {
            return res.json({ success: false, message: ' failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const potvrdaTermina = async (req,res)=>{
    try {
        const {radnikId,terminId}=req.body
        const terminData=await terminModel.findById(terminId)
        if(terminData && terminData.radnikId===radnikId){
            await terminModel.findByIdAndUpdate(terminId,{isConfirmed:true})
            return res.json({ success: true, message: 'Termin potvrđen' })
        } else {
            return res.json({ success: false, message: ' failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const radnikDashboard =async (req,res)=>{
    try {
        const {radnikId}=req.body
        const salon=await salonModel.findOne({zaposleni:radnikId})
        const termini=await  terminModel.find({naziv:salon.name})
        let earnings=0
        let prosliMesecEarnings = 0;
        const now = new Date();
        const prosliMesec = new Date(now.getFullYear(), now.getMonth() - 1);    
       
        let klijenti=[]
        const month=now.getMonth()
        const year=now.getFullYear()
        termini.forEach((item) => {
            if (item.isCompleted) {
              const terminDate = new Date(item.date);
              if (terminDate.getMonth() === month && terminDate.getFullYear() === year) 
                if (Array.isArray(item.cena)) {
                    earnings += item.cena.reduce((sum, value) => sum + value, 0); 
                }             
              if (
                terminDate.getFullYear() === prosliMesec.getFullYear() &&
                terminDate.getMonth() === prosliMesec.getMonth()
              ) {
                if (Array.isArray(item.cena)) {
                    prosliMesecEarnings += item.cena.reduce((sum, value) => sum + value, 0); 
                }              }
            }
      
            if (!klijenti.includes(item.userId)) {
              klijenti.push(item.userId);
            }
          });

        const dashData={
            earnings,
            prosliMesecEarnings,
            termini: termini.length,
            klijenti:klijenti.length,
            komentari:salon.ratings.length,
            ocena:salon.ratings,
            poslednjiTermini: termini.reverse()
        }
        res.json({success:true,dashData})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const salonRadnika = async (req,res)=>{
    try {
        const {radnikId}=req.body
        const salon=await salonModel.findOne({zaposleni:radnikId})
        res.json({success:true,salon})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message }) 
        
    }
}

const allComments=async (req,res)=>{
    try {
        const {radnikId}=req.body
        const salon=await salonModel.findOne({zaposleni:radnikId})
        const reviews = await Promise.all(salon.ratings.map(async (review) => {
            const user = await userModel.findById(review.userId).select('firstName lastName'); 
            const radnik=await radnikModel.findById(review.radnikId).select('ime prezime')
            return {
                ...review.toObject(),
                userIme: user?.firstName || 'Nepoznato', 
                userPrezime: user?.lastName || 'Nepoznato',
                radnikIme: radnik?.ime,
                radnikPrezime: radnik?.prezime
            };
        }));
        res.json({success:true,reviews:reviews 
        })
        console.log(reviews);
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message }) 
        
    }
}
const updateSalon = async (req,res)=>{
    try {
        const {salonId}=req.body
        const image = req.files ? await Promise.all(req.files.map(async (file) => {
            const uploadedImage = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
            return uploadedImage.secure_url; 
        })) : [];
        const usluge = Array.isArray(req.body.usluge) ? req.body.usluge : JSON.parse(req.body.usluge);
        const radnoVreme = Array.isArray(req.body.radnoVreme) ? req.body.radnoVreme : JSON.parse(req.body.radnoVreme);
   

        await salonModel.findByIdAndUpdate(salonId,{ $push: { image: { $each: image }}, usluge, radnoVreme } )
        res.json({success:true,message:"Salon azuriran!"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeImage=async(req,res)=>{
    try {
        const {salonId,imageUrl}=req.body
        const salon=await salonModel.findById(salonId)

        const updateImages=salon.image.filter(img=>img!==imageUrl)
        salon.image=updateImages

        await salon.save()
        res.json({success:true,message:"Slika je obrisana!"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    
    }
}


export {lista,loginRadnik,listaTerminaRadnik,otkazivanjeTermina,potvrdaTermina,radnikDashboard,salonRadnika,updateSalon,removeImage,allComments}