import salonModel from "./models/salonModel.js"; // Import salona
import terminModel from "./models/terminModel.js"; // Import termina
import radnikModel from "./models/radnikModel.js"; // Import radnika
import connectDB from "./config/mongodb.js"; // Povezivanje sa bazom
import dotenv from 'dotenv';

dotenv.config();

const updateTermini = async () => {
  try {
    // Povezivanje sa bazom podataka
    connectDB();
    console.log("Povezan sa bazom podataka...");

    // Dohvati sve termine iz baze
    const termini = await terminModel.find({});

    for (const termin of termini) {
      // Pronađi odgovarajući salon
      const salon = await salonModel.findOne({ name: termin.naziv });

      if (salon) {
        // Provera da li postoji recenzija za ovaj termin
        const hasReview = salon.ratings.some(
          (rating) =>
            rating.userId.toString() === termin.userId.toString() &&
            rating.usluga.includes(termin.usluga)
        );

        // Pronalaženje radnika (ako postoji odgovarajući radnik)
        const radnik = await radnikModel.findOne({
          _id: termin.radnikId, // ID radnika vezan za termin
        });

        // Ažuriranje termina
        termin.hasReview = hasReview; // Postavljanje `hasReview` na true ili false
        termin.radnikName = radnik ? radnik.ime : null; // Dodaj ime radnika ako postoji
        termin.uslugaName = termin.usluga; // Usluga iz termina
        termin.salonId = salon._id; // Dodaj referencu na salon

        // Sačuvaj promene termina
        await termin.save();
      }
    }

    console.log("Termini su uspešno ažurirani.");
    process.exit();
  } catch (error) {
    console.error("Greška prilikom ažuriranja termina:", error);
    process.exit(1);
  }
};

// Pokretanje funkcije
updateTermini();
