import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import './Salon.css'
import axios from 'axios'
import { toast } from 'react-toastify'
const Salon = () => {
    const { naziv } = useParams()
    const [info, setInfo] = useState({})
    const { saloni, backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()
    const [cenovnik, setCenovnik] = useState(true)
    const [informacije, setInformacije] = useState(false)
    const [utisci, setUtisci] = useState(false)
    const [usluga, setUsluga] = useState([])
    const [zakazivanje, setZakazivanje] = useState(false)
    const [odabrano, setOdabrano] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)

    const [reviews, setReviews] = useState([])


    const getReviews = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/saloni/utisci?salonId=${info._id}`)
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

    console.log(reviews);
    console.log(info._id);


    const odaberi = (usl) => {
        if (odabrano.includes(usl)) {
            setOdabrano(odabrano.filter(item => item !== usl));
        } else {
            setOdabrano([...odabrano, usl]);
        }

        setZakazivanje(odabrano.length > 0 || !odabrano.includes(usl));
    }

    const zamena = () => {
        setCenovnik(true)
        setInformacije(false)
        setUtisci(false)
    }

    const zamena1 = () => {
        setCenovnik(false)
        setInformacije(true)
        setUtisci(false)
    }

    const zamena2 = () => {
        setCenovnik(false)
        setInformacije(false)
        setUtisci(true)
    }


    const fetchInfo = () => {
        if (saloni && saloni.length > 0) {
            const info = saloni.find(salon => salon.name === naziv)
            if (info) {
                setInfo(info)
                setUsluga(info.usluge)
            }

        }


    }
    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, { rating }) => sum + rating, 0);
        return (total / ratings.length).toFixed(1); 
    }

    const addToFavorites = async (salonId) => {
        if (!token) {
            toast.error("Morate biti prijavljeni da biste dodali salon u omiljene.");
            return ('/login');
        }
        try {
            const { data } = await axios.post(backendUrl + '/api/user/omiljeni-saloni', { salonId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message);
                setIsFavorite(data.isFavorite)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + info.image.length) % info.image.length);
    };

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % info.image.length);
    };

    useEffect(() => {
        if (saloni && saloni.length > 0) {
            fetchInfo();
        }
    }, [saloni, naziv])

    useEffect(() => {
        if (!info) {
            return <div>Učitavanje...</div>;
        }
        if (info && info._id) {
            getReviews()
        }
    }, [info])
    useEffect(() => {
        const checkFavorite = async () => {
            if (!token) return;

            try {
                const { data } = await axios.get(backendUrl + '/api/user/lista-omiljenih', { headers: { token } })

                if (data.success && data.omiljeniSaloni.some(salon => salon._id === info._id)) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.log(error);

                toast.error(error.message)
            }
        };

        if (info) {
            checkFavorite();
        }
    }, [info, token]);


    return info && (
        <div className='div-salon'>
            <div className='left-div-info'>
                <div className='left-div'>
                    <div className="image-container">
                        <button onClick={prevSlide}><span className="mdi mdi-arrow-left-bold"></span></button>

                        {info.image?.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Image ${index + 1}`}
                                className={index === currentIndex ? 'active' : ''}
                            />
                        ))}
                        <button onClick={nextSlide}><span className="mdi mdi-arrow-right-bold"></span></button>
                    </div>

                    <div className='info-div'>
                        <h1 className='naziv'>{naziv}
                            <span onClick={() => addToFavorites(info._id)} className={`mdi ${isFavorite ? "mdi-heart" : "mdi-heart-outline"} heart-icon`}></span></h1>
                        <p className='tip'>{info.tip}</p>
                        <p className='tip-ocena'>{calculateAverageRating(info.ratings)}</p>
                    </div>
                </div>
                <div className='zakazivanje'>
                    {
                        zakazivanje && odabrano.length > 0 && (
                            <div className='div-zakazivanje'>
                                <p>Izabrali ste:  {odabrano.map((usl, index) => (
                                    <span key={index}>{usl} </span>
                                ))}  </p>
                                <button onClick={() => navigate(`/termin/${naziv}/${odabrano}`)}>Zakažite tretman</button>
                            </div>

                        )}
                </div>
            </div>



            <div className='right-div'>
                <ul className='right-ul'>

                    <li className={`cenovnik ${cenovnik ? 'active' : ''}`} onClick={zamena}>Cenovnik </li>
                    <li className={`informacije ${informacije ? 'active' : ''}`} onClick={zamena1}>Informacije </li>
                    <li className={`utisci ${utisci ? 'active' : ''}`} onClick={zamena2}>Utisci ({reviews.length})</li>

                </ul>
                <div className='usluge'>
                    {
                        cenovnik && (

                            <div >

                                {

                                    usluga.map((item, index) => (
                                        <div className='usluga' key={index}>
                                            <h2>{item.usluga} <p>RSD</p></h2>
                                            <div className='tipovi'>
                                                <div className='tipovi-ime'>


                                                    {item.podtip.map((tip, ind) => (

                                                        <p key={ind} className={odabrano.includes(tip) ? 'oznaceno' : ''} onClick={() => { odaberi(tip); scrollTo(0, 300) }}>{tip}


                                                        </p>




                                                    ))
                                                    }



                                                </div>
                                                <div className='tipovi-cena'>
                                                    {item.cena.map((item, index) => (
                                                        <p key={index}>{item}</p>
                                                    ))}
                                                </div>

                                            </div>


                                        </div>


                                    ))
                                }




                            </div>

                        )
                    }
                </div>



                <div className='inf'>
                    {informacije && (
                        <div>
                            <p>{info.informacije}</p>
                            <div className='mapa'>
                                <a href={info.link} target="_blank" rel="noopener noreferrer">
                                    <iframe
                                        src={info.mapUrl}
                                        width="600"
                                        height="350"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Mapa ${naziv}`}
                                    ></iframe>
                                </a>
                            </div>
                            <div className='div-vreme'>
                                <p>Radno vreme</p>
                                {
                                    info.radnoVreme.map((item, index) => (
                                        <ul>
                                            <li key={index}>{item.dan} <span>{item.vreme}</span></li>
                                        </ul>

                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="utisci">
                    {
                        utisci && (
                            <div>
                                {
                                    reviews.map((item, index) => (
                                        <div className="utisak" key={index}>
                                            <div className='utisak-div'>
                                                <p>Ocena <span className='tip-ocena'>{item.rating}</span>  za uslugu {item.usluga}</p>
                                                <p>{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className='utisak-info'>
                                                <p>{item.userIme} {item.userPrezime}</p>

                                                <p>{item.comment}</p>
                                                <p>Radnik: {item.radnikIme} {item.radnikPrezime}</p>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>




            </div>

        </div>
    )
}

export default Salon