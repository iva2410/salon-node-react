import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Reviews.css'
const Reviews = () => {

    const { backendUrl, token } = useContext(AppContext)
    const [reviews, setReviews] = useState([])

    const getUserReviews = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-reviews', { headers: { token } })
            if (data.success) {
                setReviews(data.reviews);  
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    }

    useEffect(() => {
        if (token) {
            getUserReviews()
        }
    }, [token])

    return (
        <div className='div-komentari'>
            <h2>Vaše recenzije</h2>
            {
                reviews.length > 0 ? (
                    reviews.map((item, index) => (
                        <div key={index}>
                            <h3>{item.salonName}</h3>
                            <ul>
                                {item.reviews.map((review) => (
                                    <li key={review._id}>
                                        <p>Ocena: {review.rating}</p>
                                        <p>Usluga: {review.usluga}</p>
                                        <p>Komentar: {review.comment}</p>
                                        <p>Datum: {new Date(review.date).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>Još uvek nemate komentare</p>
                )}
        </div>
    )
}

export default Reviews