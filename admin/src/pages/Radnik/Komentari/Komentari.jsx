import React from 'react'
import { useContext } from 'react'
import { RadnikContext } from '../../../context/RadnikContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import './Komentari.css'
const Komentari = () => {
  const { backendUrl, rToken, calculateAverageRating } = useContext(RadnikContext)

  const [reviews, setReviews] = useState([])


  const getReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/radnici/get-comments', { headers: { rToken } })
      if (data.success) {
        setReviews(data.reviews)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
 
  const calculateRatingDistribution = (ratings) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratings && ratings.length > 0) {
      ratings.forEach(({ rating }) => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });
    }
    return distribution;
  };

  const generateStars = (rating) => {
    const maxStars = 5;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="fas fa-star full-star"></i>);
      } else if (i - rating <= 0.5) {
        stars.push(<i key={i} className="fas fa-star-half-alt half-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star empty-star"></i>);
      }
    }

    return stars;
  };



  useEffect(() => {
    if (rToken) {
      getReviews()
    }
  }, [rToken])
  console.log(reviews);

  return (
    <div className='page-container'>
      <p className='p-add'>Recenzije salona</p>

      <div className='container'>
        <div className='reviews'>
          <div className='summary-item'>
            <h2>Broj recenzija</h2>
            <p className='total-reviews'>{reviews.length}</p>
          </div>
          <div className='summary-item-1' >
            <h2>Prosečna ocena</h2>
            <p className='average-rating'> {calculateAverageRating(reviews)} <span className="stars">{generateStars(calculateAverageRating(reviews))}</span></p>
          </div>
          <div className='ratings-distribution'>
            <ul>
              {Object.entries(calculateRatingDistribution(reviews)).reverse().map(([rating, count]) => (
                <li key={rating} className='distribution-item'>
                  <span className='rating-number'>{rating} ★</span>
                  <div className='rating-bar'>
                    <div
                      className='filled-bar'
                      style={{
                        width: `${(count / reviews.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className='count'>{count}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className='ratings'>
          {
            reviews.map((item, index) => (
              <div className='ratings-div' key={index}>
                <div>
                  <h2>{item.userIme} {item.userPrezime}</h2>
                  <p>Usluga: {item.usluga}</p>
                  <p>Radnik: {item.radnikIme} {item.radnikPrezime}</p>
                </div>
                <div className='div-stars'>
                  <p>{generateStars(item.rating)} {new Date(item.date).toLocaleDateString()}</p>
                  <div className="review-rating">
                    <p>Komentar: {item.comment}</p>

                  </div>


                </div>


              </div>

            ))
          }

        </div>

      </div>
    </div>
  )
}

export default Komentari