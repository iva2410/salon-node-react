import mongoose from 'mongoose';
import salonModel from './models/salonModel.js'; // Prilagodite putanju prema lokaciji vašeg modela
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js'

dotenv.config(); // Ako koristite .env fajl za povezivanje sa bazom

const updateSaloni = async () => {
  try {
    connectDB()
    console.log('Povezan sa bazom podataka.');
    const salons = await salonModel.find({});
    console.log('Pronađeno salona:', salons.length);
    for (const salon of salons) {
        // Proverite da li salon ima `ratings`, ako ne, dodajte ga
        if (!salon.ratings || salon.ratings.length === 0) {
          const defaultRatings = [
            {
              userId: new mongoose.Types.ObjectId(), // Kreirajte lažni ID (ili koristite stvarne podatke)
              rating: 5,
              comment: 'Default recenzija',
              date: new Date(),
            },
          ];
  
          // Ažurirajte salon sa novim `ratings`
          await salonModel.updateOne({ _id: salon._id }, { $set: { ratings: defaultRatings } });
          console.log(`Salon ${salon.name} je ažuriran.`);
        }
      }

    await mongoose.disconnect();
    console.log('Konekcija sa bazom zatvorena.');
  } catch (error) {
    console.error('Greška prilikom ažuriranja salona:', error);
    mongoose.disconnect();
  }
};

updateSaloni();
