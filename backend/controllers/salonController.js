import radnikModel from "../models/radnikModel.js";
import salonModel from "../models/salonModel.js"
import userModel from "../models/userModel.js";
import terminModel from "../models/terminModel.js"

const salonList=async(req,res)=>{
    try {
        const saloni=await salonModel.find({}).populate('zaposleni');
        res.json({success:true,saloni})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

const allComments=async (req,res)=>{
    try {
        const {salonId}=req.query
        const salon=await salonModel.findById(salonId)
        console.log("Salon:", salon);

       
        const reviews = await Promise.all(salon.ratings.map(async (review) => {
            console.log("User ID:", review.userId);

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
        if (!salon.ratings || salon.ratings.length === 0) {
            res.json({ success: true, reviews: [] });
          }
        else{
              res.json({success:true,reviews:reviews 
        })
        }
      
        

        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message }) 
        
    }
}
const updateCompletedTretmani = async () => {
    try {

        const today = new Date();
        const todayString = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

       
        const currentTimeString = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

        
        const result = await terminModel.updateMany(
            {
                $or: [
                   
                    { slotDate: { $lt: todayString } },
                   
                    { slotDate: todayString, slotTime: { $lt: currentTimeString } }
                ]
            },
            { $set: { isCompleted: true } } 
        );

        if (result.modifiedCount > 0) {
            console.log(`${result.modifiedCount} tretmana su označena kao completed.`);
        } else {
            console.log('Nema tretmana koji su završeni pre današnjeg datuma ili vremena.');
        }
    } catch (error) {
        console.error('Greška prilikom ažuriranja tretmana:', error.message);
    }
};

updateCompletedTretmani();



export {salonList, updateCompletedTretmani, allComments}