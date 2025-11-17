import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Recenzije.css'
const Recenzije = ({ selectedTermin, closeModal, onReviewSubmit }) => {
  const { backendUrl, token, loadSaloni } = useContext(AppContext)

  const [reviews, setReviews] = useState(
    selectedTermin.usluga.map((usluga) => ({
      naziv: usluga,
      rating: 0,
      comment: ''
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index][field] = value;
    setReviews(updatedReviews);
  }
  console.log('Reviews:', reviews);



  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reviews.every(r => r.naziv && r.rating > 0 )) {
      toast.error('Neki podaci o recenzijama nisu ispravni!');
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/dodaj-ocenu`,
        {
          terminId: selectedTermin._id,
          naziv: selectedTermin.naziv,
          reviews: reviews.map((review) => ({
            
            
            naziv: review.naziv, 
            rating: review.rating,
            comment: review.comment, 
            radnikId: selectedTermin.radnikData._id
          }))
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Sve recenzije su uspešno dodate.');
        onReviewSubmit(selectedTermin.usluga);
        closeModal();
        loadSaloni();
      } else {
        toast.error(data.message);
        console.log(data.message);
        
      }
    } 
      catch (error) {
        console.error('Axios greška:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Greška prilikom dodavanja recenzija');
      
      
    }
  }
  console.log(selectedTermin.naziv);

  return (
    <div className="dodaj-recenziju">
      <h2>Dodajte recenzije za sve usluge</h2>
      <form onSubmit={handleSubmit}>
      <div className="termin-info">
          <p>Radnik: {selectedTermin.radnikData.ime} {selectedTermin.radnikData.prezime}</p>
          <p>Datum: {selectedTermin.slotDate.replace(/_/g, '.')}</p>
          <p>Vreme: {selectedTermin.slotTime}</p>
        </div>
        {reviews.map((review, index) => (
          <div key={index} className="form-group">
            <p>Usluga: {review.naziv}</p>
            <label>Ocena (1-5):</label>
            <select
              value={review.rating}
              onChange={(e) => handleChange(index, 'rating', Number(e.target.value))}
              required
            >
 <option value="">Izaberite ocenu</option>
            <option value="1">1 - Loše</option>
            <option value="2">2 - Slabo</option>
            <option value="3">3 - Dobro</option>
            <option value="4">4 - Veoma dobro</option>
            <option value="5">5 - Odlično</option>
            </select>
            <label>Komentar (opciono):</label>
            <textarea
              value={review.comment}
              onChange={(e) => handleChange(index, 'comment', e.target.value)}
            />
          </div>
        ))}
        <button type="submit" className="submit-btn">
          Pošalji recenzije
        </button>
      </form>
    </div>

  )
}

export default Recenzije