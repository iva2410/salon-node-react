import salonModel from "./models/salonModel.js"; // Importujte vaš Salon model
import radnikModel from "./models/radnikModel.js"; // Importujte vaš Radnik model
import connectDB from "./config/mongodb.js";
import dotenv from 'dotenv';
dotenv.config();
const updateReviews = async () => {
  try {
    // Povezivanje sa bazom podataka
    connectDB()

    console.log("Povezan sa bazom podataka...");

    // Dohvat svih salona iz baze
    const salons = await salonModel.find({}) //  za lakšu obradu podataka

    for (const salon of salons) {
      if (salon.ratings && salon.ratings.length > 0) {
        for (const rating of salon.ratings) {
          // Pronalaženje radnika (ako postoji odgovarajući radnik)
          const radnik = await radnikModel.findOne({
            _id: { $in: salon.zaposleni }, // Da li radnik pripada listi zaposlenih u salonu
          });

          // Pronalaženje usluge (ako postoji odgovarajuća usluga)
          let uslugaFound = null;
          let poduslugaFound = null;
    
          for (const usluga of salon.usluge) {
            if (rating.comment?.includes(usluga.usluga)) {
              uslugaFound = usluga;
    
              // Proveravamo podusluge unutar pronađene usluge
              poduslugaFound = usluga.podtip.find((podtip) =>
                rating.comment?.toLowerCase().includes(podtip.toLowerCase())
              );
              break; // Prekidamo jer smo pronašli odgovarajuću uslugu
            }
          }
          console.log('Pronađena usluga:', uslugaFound);
          console.log('Pronađena podusluga:', poduslugaFound);
          // Ažuriranje postojećih referenci
          rating.radnikId = radnik ? radnik._id : null; // Ako radnik postoji, dodaj njegov ID
      rating.usluga = uslugaFound ? uslugaFound: null; // Dodaj ID usluge ako postoji
      rating.podusluga = poduslugaFound || null; // Dodaj naziv podusluge ako postoji
    }

        // Snimanje ažuriranih podataka nazad u bazu
        await salonModel.findByIdAndUpdate(salon._id, { ratings: salon.ratings });
      }
    }

    console.log("Recenzije su uspešno ažurirane.");
    process.exit();
  } catch (error) {
    console.error("Greška prilikom ažuriranja recenzija:", error);
    process.exit(1);
  }
};

// Pokretanje funkcije
updateReviews();
