import validator from "validator"
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import radnikModel from "../models/radnikModel.js"
import salonModel from "../models/salonModel.js"
import terminModel from "../models/terminModel.js"

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body


        if (!firstName || !lastName || !email || !password) {
            return res.json({ success: false, message: "Niste uneli sve podatke" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Unesite pravilan email" })
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Unesite najmanje 6 karaktera" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            firstName,
            lastName,
            password: hashedPassword,
            email
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'Korisnik ne postoji!' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Pogresna lozinka' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, firstName, lastName, phone } = req.body
        console.log(req.body);

        if (!firstName || !lastName || !phone) {
            return res.json({ success: false, message: "Nedostaju podaci" })
        }
        await userModel.findByIdAndUpdate(userId, { firstName, lastName, phone })


        res.json({ success: true, message: 'Profil azuriran!' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const zakaziTretman = async (req, res) => {
    try {
        const { userId, radnikId, slotDate, slotTime,naziv,usluga,cena } = req.body

        console.log(req.body)
        console.log(naziv);
        

        const salon = await salonModel.findOne({name:naziv}).populate('zaposleni')

        const radnikData = await radnikModel.findById(radnikId).select('-password')
        
        
        if (!salon) {
            return res.json({ success: false, message: 'Salon nije pronađen' });
        }
        if (!radnikData) {
            return res.json({ success: false, message: 'Radnik nije pronađen' });
        }

        
        

        let slots_booked = radnikData.slots_booked
   
        

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Termin nije dostupan' })

            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData= await userModel.findById(userId).select('-password')

        delete radnikData.slots_booked

        const terminData={
            userId,
            radnikId,
            userData,
            radnikData,
            naziv,
            slotTime,
            slotDate,
            cena,
            usluga,
            date: Date.now()
        }
        const novTermin=new terminModel(terminData)
        await novTermin.save()
        
        await radnikModel.findByIdAndUpdate(radnikId,{slots_booked})
        res.json({success:true,message:'Uspešno ste zakazali termin!'})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listaTermina=async(req,res)=>{
    try {
        const {userId}=req.body
        const termini=await terminModel.find({userId})
        res.json({success:true,termini})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
   
    }
}

const termin=async(req,res)=>{
    try {
        const {terminId}=req.params
        const termin=await terminModel.findById(terminId)
        res.json({success:true,termin})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })     
    }
}

const otkaziTretman=async(req,res)=>{
    try {
        const {userId,terminId}=req.body
        const terminData=await terminModel.findById(terminId)
        
        if(terminData.userId!== userId){
            return res.json({success:false,message:"Niste autorizovani!"})
        }

        await terminModel.findByIdAndUpdate(terminId,{cancel:true})

        const {radnikId, slotDate,slotTime}=terminData

        const radnikData=await radnikModel.findById(radnikId)

        let slots_booked=radnikData.slots_booked

        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
        
        await radnikModel.findByIdAndUpdate(radnikId,{slots_booked})
        res.json({success:true,message:"Termin otkazan!"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
   
    }
}

const addFavoriteSalon=async(req,res)=>{
    try {
        const {userId,salonId}=req.body
        const salon=await salonModel.findById(salonId)
        const user=await userModel.findById(userId)

        if(user.omiljeniSaloni.includes(salonId)){
            user.omiljeniSaloni=user.omiljeniSaloni.filter(id=>id.toString()!==salonId)
            await user.save()
        res.json({success:true,message:"Uklonili ste salon iz omiljenih!",isFavorite:false})

        }else{
            user.omiljeniSaloni.push(salonId)
            await user.save()
            res.json({success:true,message:"Dodali ste salon u omiljene!",isFavorite:true})
    
        }
      
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getFavoriteSalons=async(req,res)=>{
    const {userId}=req.body

    try {

        const omiljeni=await userModel.findById(userId).populate("omiljeniSaloni")
        res.json({success:true,omiljeniSaloni:omiljeni.omiljeniSaloni})
        console.log(omiljeni);
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getComments=async(req,res)=>{
    const {userId}=req.body
    try {
        const saloni=await salonModel.find({'ratings.userId':userId})
        console.log(saloni);
        
        const userReviews = saloni.map(salon => {
            return {                
              salonName: salon.name,
              reviews: salon.ratings.filter(rating => rating.userId.toString() === userId.toString())
            };
          });
          res.json({
            success: true,
            reviews: userReviews
          });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const addRating = async (req, res) => {
    try {
      const { naziv, terminId, reviews } = req.body;
      console.log(req.body);

      const termin = await terminModel.findById(terminId);
      if (!termin) {
        return res.json({ success: false, message: 'Termin nije pronađen.' });
      }
  
      const salon = await salonModel.findOne({ name: naziv });
      if (!salon) {
        return res.json({ success: false, message: 'Salon nije pronađen.' });
      }
  console.log(salon);
  
      for (const review of reviews) {
        const { naziv, rating, comment, radnikId } = review;
  
        const user = await userModel.findById(termin.userId);
        if (!user) {
          return res.json({ success: false, message: 'Korisnik nije pronađen.' });
        }
  
        let existingRating = salon.ratings.find(
          (r) =>
            r.userId.toString() === termin.userId.toString() &&
            r.radnikId.toString() === radnikId.toString() &&
            (Array.isArray(r.usluga) ? r.usluga.includes(naziv) : r.usluga === naziv)

        );
        console.log('Sve ocene u salonu:', salon.ratings);
        console.log('Naziv usluge:', naziv);
        console.log('Radnik ID:', radnikId);
        console.log('Termin userId:', termin.userId);
        
     console.log(existingRating);
        if (existingRating) {
          existingRating.rating = rating;
          existingRating.comment = comment || existingRating.comment;
        } else {
          salon.ratings.push({
            userId: termin.userId,
            userIme: user.firstName,
            radnikId,
            usluga: [naziv],
            rating,
            comment: comment || '',
          });
        }
      }
     
      termin.hasReview = true;
      await termin.save();
  
      await salon.save();
  
      res.json({ success: true, message: 'Sve recenzije su uspešno dodate.' });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'Greška na serveru.' });
    }
  };
  
export { registerUser, loginUser,getComments, getFavoriteSalons , addRating, getProfile, listaTermina ,updateProfile,zakaziTretman,otkaziTretman,addFavoriteSalon, termin }