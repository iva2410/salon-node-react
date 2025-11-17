import React from 'react'
import { useContext } from 'react'
import { RadnikContext } from '../../../context/RadnikContext'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from '../../../assets/assets'
import './Salon.css'

const Salon = () => {
  const { rToken, backendUrl, calculateAverageRating } = useContext(RadnikContext)

  const [images, setImages] = useState([])
  const [workingHours, setWorkingHours] = useState([]);
  const [services, setServices] = useState([])

  const [salon, setSalon] = useState(null)
  useEffect(() => {
    if (salon) {

      setWorkingHours(salon.radnoVreme || []);
      setServices(salon.usluge || []);
    }
  }, [salon]);
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      src: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };


  const handleRemoveExistingImage = async (imageUrl, index) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/radnici/delete-image', { salonId: salon._id, imageUrl }, { headers: { rToken } })
      if (data.success) {
        toast.success(data.message);
        const newImages = [...images];
        newImages.splice(index, 1);  
        setImages(newImages);

        const updatedSalon = { ...salon };
        updatedSalon.image = updatedSalon.image.filter((img) => img !== imageUrl);
        setSalon(updatedSalon);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const getSalon = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/radnici/radnik-salon', { headers: { rToken } })
      if (data.success) {
        setSalon(data.salon)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSaveChanges = async () => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('image', image.file)
    })

    formData.append('salonId', salon._id);
    formData.append('radnoVreme', JSON.stringify(workingHours));
    formData.append('usluge', JSON.stringify(services));

    try {
      const { data } = await axios.post(backendUrl + '/api/radnici/update-salon', formData, { headers: { rToken } })
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);

    }
  }
  useEffect(() => {
    if (rToken) {
      getSalon()
    }
  }, [rToken])
  return (
    <div className='page-container'>
      <p className='p-add'>{salon?.name}</p>
      <div className='container'>
        <div className='usluga-div'>
          <p>Tip salona - {salon?.tip}</p>
          <p>Ocena - {calculateAverageRating(salon?.ratings)}</p>
          <p>Grad - {salon?.grad}</p>
        </div>
        <div className='usluga-div-first'>
          <label className="upload-zone">
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="hidden-input"
            />
            <img src={assets.gallery_add} alt="" />
            <span className="upload-text">Dodaj fotografije</span>
          </label>

          <div className="image-list">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.src} alt='Uploaded ' className="uploaded-image" />
                <div className="overlay">

                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="overlay-button remove-button"
                  >
                    Obrisi
                  </button>
                </div>
              </div>
            ))}
            {salon?.image.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image} alt='Uploaded ' className="uploaded-image" />
                <div className="overlay">

                  <button
                    onClick={() => handleRemoveExistingImage(image, index)}
                    className="overlay-button remove-button"
                  >
                    Obrisi
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>
        <div className='usluga-div'>
          {
            salon?.usluge.map((item,itemIndex) => (
              <div className='usluga' key={item._id}>
                <div className='div-usluga'><h2>{item.usluga}</h2> <p>RSD</p></div>
                <div className='tipovi-usluge'>
                  <div className='tipovi-ime'>

                    {item.podtip.map((tip, tipIndex) => (

                      <p key={tipIndex}>{tip}</p>
                    ))
                    }



                  </div>
                  <div className='tipovi-cena'>
                    {item.cena.map((item, priceIndex) => (
                      <input className='input-usluga'
                        key={priceIndex}
                        type="number"
                        placeholder={item}
                        value={item}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[itemIndex].cena[priceIndex] = e.target.value;
                          setServices(newServices);
                        }}
                      />
                    ))}
                  </div>

                </div>


              </div>


            ))
          }

        </div>

        <div className='usluga-div'>

          <div className='vreme-div'>
            <h2>Radno vreme</h2>

            {salon?.radnoVreme.map((day, index) => (
              <div key={day.dan} className='div-dan'>
                <label>
                  {day.dan}:
                  <input
                    type="text"
                    placeholder={day}
                    value={day.vreme}
                    onChange={(e) => {
                      const newWorkingHours = [...workingHours];
                      newWorkingHours[index].vreme = e.target.value;
                      setWorkingHours(newWorkingHours);
                    }}
                    className='dan-input'
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className='add-btn' onClick={handleSaveChanges}>Sačuvaj izmene</button>

    </div>
  )
}

export default Salon