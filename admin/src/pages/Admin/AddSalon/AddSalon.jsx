import React, { useContext, useState } from 'react'
import { assets } from '../../../assets/assets';
import './AddSalon.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../../context/AdminContext';



const AddSalon = () => {
  const [images, setImages] = useState([]);
  const [selectedTip, setSelectedTip] = useState('Frizerski salon');
  const [selectedUsluge, setSelectedUsluge] = useState([]);
  const [mapUrl, setMapUrl] = useState('');
  const [employees, setEmployees] = useState([])
  const [emp, setEmp] = useState([]);
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [lokacija, setLokacija] = useState('')
  const [grad, setGrad] = useState('Niš')

  const [naziv, setNaziv] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const handleAddEmployee = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData()
      formData.append('ime', ime)
      formData.append('prezime', prezime)
      formData.append('password', password)
      formData.append('email', email)

      formData.forEach((val, key) => {
        console.log(`${key} ${val}`);

      })

      const { data } = await axios.post(backendUrl + '/api/admin/add-radnik-salon', formData, { headers: { aToken } })
      console.log("Odgovor sa servera:", data);

      if (data.success) {
        toast.success(data.message)
        const noviZaposleni = { ime, prezime, email, _id: data.id };
        setEmp((prevEmployees) => [...prevEmployees, data.id])
        console.log(noviZaposleni);


        setEmployees([...employees, { ime, prezime, email }])
        setIme('')
        setPrezime('')
        setPassword('')
        setEmail('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  };




 
  const uslugeOptions = {
    "Frizerski salon": [
      { usluga: "Šišanje", podtip: ["Žensko šišanje - kratka kosa", "Žensko šišanje - kosa srednje dužine", "Žensko šišanje - duga kosa", "Šišanje i feniranje", "Muško šišanje"], cena: [] },
      { usluga: "Muško šišanje", podtip: ["Muško šišanje mašinicom","Muško šišanje makazama","Skraćivanje brade" ], cena: [] },
      { usluga: "Feniranje", podtip: ["Feniranje na lokne", "Feniranje na ravno", "Feniranje na talase"], cena: [] },
      { usluga: "Farbanje", podtip: ["Farbanje cele kose - kratka kosa", "Farbanje cele kose - kosa srednje duzine", "Farbanje cele kose - duga kosa", "Farbanje izrastka", "Preliv", "Pramenovi", "Balayage"], cena: [] },
      { usluga: "Frizure", podtip: ["Peglanje kose", "Lokne", "Svečana frizura", "Rep", "Pletenice"], cena: [] },
      { usluga: "Šminkanje", podtip: ["Šminkanje"], cena: [] },

    ],
    "Kozmetički salon": [
      { usluga: "Manikir i pedikir", podtip: ["Manikir", "Gel lak - ruke", "Pedikir", "Lakiranje noktiju", "Gel lak - noge", "Skidanje laka", "Korekcija noktiju"], cena: [] },
      { usluga: "Izlivanje i nadogradnja noktiju", podtip: ["Ojačavanje noktiju gelom", "Nadogradnja noktiju", "Izlivanje noktiju", "Korekcija noktiju"], cena: [] },
      { usluga: "Tretmani lica", podtip: ["Higijenski tretman lica", "Biološki tretman lica", "Tretman lica voćnim kiselinama", "Hemijski piling", "Čišćenje lica"], cena: [] },
      { usluga: "Trepavice i obrve", podtip: ["Oblikovanje obrva", "Farbanje obrva", "Nadogradnja svilenih trepavica - 1 na 1", "Nadogradnja trepavica - ruski volument", "Korekcija nadogradnje trepavica", "Lash lift", "Brow lift"], cena: [] },
      { usluga: "Laserska epilacija", podtip: ["Epilacija celog tela", "Epilacija nogu", "Epilacija ruku", "Epilacija lica"], cena: [] },
      { usluga: "Depilacija", podtip: ["Depilacija nogu hladnim voskom", "Depilacija ruku hladnim voskom", "Depilacija nogu toplim voskom", "Depilacija ruku toplim voskom", "Depilacija šećernom pastom"], cena: [] },
      { usluga: "Masaže", podtip: ["Terapeutska masaža - 30 minuta", "Terapeutska masaža - 60 minuta", "Relax masaža - 45 minuta", "Relax masaža - 60 minuta", "Anticelulit masaža", "Maderoterapija", "Sportska masaža", "Masaža lica"], cena: [] },
      { usluga: "Šminkanje", podtip: ["Šminkanje"], cena: [] },

    ],
    "Studio za masažu": [
      { usluga: "Masaže", podtip: ["Terapeutska masaža - 30 minuta", "Terapeutska masaža - 60 minuta", "Relax masaža - 45 minuta", "Relax masaža - 60 minuta", "Anticelulit masaža", "Maderoterapija", "Sportska masaža", "Masaža lica"], cena: [] }
    ]
  };



  const handleTipChange = (e) => {
    setSelectedTip(e.target.value);
    setSelectedUsluge([]); 
  }

  const handleUslugaChange = (usluga) => {
    const isSelected = selectedUsluge.some(item => item.usluga === usluga);
    if (isSelected) {
      setSelectedUsluge(selectedUsluge.filter(item => item.usluga !== usluga));
    } else {
      setSelectedUsluge([
        ...selectedUsluge,
        {
          usluga: usluga,
          podtip: [],
          cena: []
        }
      ]);
    }
  };
  const handlePodtipChange = (usluga, podtip) => {
    const updatedServices = selectedUsluge.map(service => {
      if (service.usluga === usluga) {
        const alreadyExists = service.podtip.includes(podtip);
        const newPodtip = alreadyExists
          ? service.podtip.filter(pt => pt !== podtip)
          : [...service.podtip, podtip];
        
        const newCena = alreadyExists
          ? service.cena.slice(0, service.podtip.indexOf(podtip))
            .concat(service.cena.slice(service.podtip.indexOf(podtip) + 1))
          : [...service.cena, 0]; 
  
        return { ...service, podtip: newPodtip, cena: newCena };
      }
      return service;
    });
  
    setSelectedUsluge(updatedServices);
  };
  

  const handlePriceChange = (usluga, podtipIndex, cena) => {
    const brojCena = parseFloat(cena);
    if (isNaN(brojCena)) {
      console.error("Uneta cena nije validan broj:", cena);
      return;
    }
  
    const updatedServices = selectedUsluge.map(service => {
      if (service.usluga === usluga) {
        const updatedCena = [...service.cena];
        updatedCena[podtipIndex] = brojCena; 
        return { ...service, cena: updatedCena };
      }
      return service;
    });
  
    setSelectedUsluge(updatedServices);  
  };
  


  const [workingHours, setWorkingHours] = useState([
    { dan: "Ponedeljak", vreme: "" },
    { dan: "Utorak", vreme: "" },
    { dan: "Sreda", vreme: "" },
    { dan: "Četvrtak", vreme: "" },
    { dan: "Petak", vreme: "" },
    { dan: "Subota", vreme: "" },
    { dan: "Nedelja", vreme: "" }
  ]);

  const handleWorkingHoursChange = (index, newTime) => {
    const updatedHours = [...workingHours];
    updatedHours[index].vreme = newTime;
    setWorkingHours(updatedHours);
  };


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

  /*const handlePriceChange = (usluga, cena) => {
    setSelectedUsluge(selectedUsluge.map(item =>
      item.usluga === usluga ? { ...item, cena } : item
    ));
  };*/



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const validatedUsluge = selectedUsluge.map(service => ({
        ...service,
        cena: service.podtip.map((_, index) => service.cena[index] || "")
      }));

      const formData = new FormData()
      formData.append('name', naziv),
        formData.append('tip', selectedTip),
        formData.append('grad', grad),
        formData.append('usluge', JSON.stringify(validatedUsluge)),
        formData.append('informacije', lokacija),
        formData.append('zaposleni', JSON.stringify(emp)),
        formData.append('radnoVreme', JSON.stringify(workingHours)),
        formData.append('mapUrl', mapUrl)


      images.forEach(image => {
        formData.append("image", image.file);  
      });

      const { data } = await axios.post(backendUrl + '/api/admin/add-salon', formData, { headers: { aToken } })
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

      setNaziv('')
      setImages([])
      setSelectedTip('')
      setGrad('')
      setEmployees([])
      setEmp([])
      setSelectedUsluge([])
     // workingHours([])
      setGrad('')
      setLokacija('')
      setMapUrl('');
    } catch (error) {
      toast.error(error.message)
    }

  }

  return (
    <div className='page'>

      <form onSubmit={handleSubmit} className='page-container'>
        <p className='p-add'>Dodaj salon</p>

        <div className='container'>
          <div className='first'>


            <div className='first-left'>
              <p>Naziv salona</p>
              <input onChange={(e) => setNaziv(e.target.value)} value={naziv} className='naziv-input' type="text" placeholder='naziv' required />
            </div>

            <div className='first-right'>
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
              </div>
            </div>
          </div>

          <div className='first'>


            <div className='first-left'>
              <p>Tip salona</p>
              <select className="styled-select" onChange={handleTipChange} value={selectedTip}>

                {Object.keys(uslugeOptions).map((tip) => (
                  <option key={tip} value={tip}>{tip}</option>
                ))}
              </select>


              {selectedTip && (
                <div className='usluge-div'>
                  <p>Usluge</p>
                  <div>
                    {uslugeOptions[selectedTip].map((usluga) => (
                      <div key={usluga.usluga}>
                        <label className='usluga-ime'>
                          <input
                            type="checkbox"
                            checked={selectedUsluge.some(item => item.usluga === usluga.usluga)}
                            onChange={() => handleUslugaChange(usluga.usluga)}
                          />
                          {usluga.usluga}
                        </label>

                        {/* If the service is selected, show sub-services and prices */}
                        {selectedUsluge.some(item => item.usluga === usluga.usluga) && (
                          <div className="podusluge">
                            {usluga.podtip.map((podtip, podtipIndex) => (
                              <div className="podusluge-div" key={`${usluga.usluga}-${podtip}`}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={selectedUsluge.find(item => item.usluga === usluga.usluga)?.podtip.includes(podtip)}
                                    onChange={() => handlePodtipChange(usluga.usluga, podtip)}
                                  />
                                  {podtip}
                                </label>
                                {/* Input za cenu */}
                                {selectedUsluge.find(item => item.usluga === usluga.usluga)?.podtip.includes(podtip) && (
                                  <input
                                    className="input-usluga"
                                    type="number"
                                    placeholder="Cena"
                                    key={`price-${usluga.usluga}-${podtip}`}
                                    value={
                                      selectedUsluge.find(item => item.usluga === usluga.usluga)?.cena[podtipIndex] || ''
                                    }
                                    onChange={(e) =>
                                      handlePriceChange(usluga.usluga, podtipIndex, parseFloat(e.target.value))
                                    }
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div className='vreme-div'>
                <h2>Unos radnog vremena</h2>

                {workingHours.map((day, index) => (
                  <div key={day.dan} className='div-dan'>
                    <label>
                      {day.dan}:
                      <input
                        type="text"
                        placeholder="09:00 - 17:00 ili Zatvoreno"
                        value={day.vreme}
                        onChange={(e) => handleWorkingHoursChange(index, e.target.value)}
                        className='dan-input'
                      />
                    </label>
                  </div>
                ))}
              </div>

            </div>
            <div className='second-right'>
              <p>Lokacija</p>
              <input onChange={(e) => setLokacija(e.target.value)} value={lokacija} className='naziv-input' type="text" placeholder='Ulica, broj, sprat...' required />

              <p>Grad</p>
              <select onChange={(e) => setGrad(e.target.value)} value={grad} className="styled-select" name='' id=''>
                <option value="Pirot">Pirot</option>
                <option value="Niš">Niš</option>
                <option value="Kragujevac">Kragujevac</option>
                <option value="Kruševac">Kruševac</option>
                <option value="Beograd">Beograd</option>
                <option value="Novi Sad">Novi Sad</option>
              </select>






              URL mape:
              <input
                type="text"
                placeholder="Unesite URL mape sa Google Maps"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className='naziv-input'
              />


              {mapUrl && (
                <div >
                  <p>Pregled mape:</p>
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa salona"
                  ></iframe>
                </div>
              )}


            </div>
          </div>




          <button type='submit' className='add-btn'>Dodaj salon</button>


        </div>
      </form>

      <form className='page-container' onSubmit={handleAddEmployee} >
        <div className='container-div'>


          <div className='radnik-div'>


            <h3>Dodaj radnika</h3>
            <div >
              <label>Ime:
                <input onChange={(e) => setIme(e.target.value)}
                  type="text"
                  value={ime}

                  placeholder="Unesite ime"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Prezime:
                <input onChange={(e) => setPrezime(e.target.value)}
                  type="text"
                  value={prezime}

                  placeholder="Unesite prezime"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Email:
                <input onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}

                  placeholder="Unesite email"
                  className="dan-input" required
                /></label>
            </div>
            <div>
              <label>Šifra:
                <input onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  value={password}

                  placeholder="Unesite šifru"
                  className="dan-input" required
                /></label>
            </div>
            <button className='add-btn' type="submit">
              Dodaj radnika
            </button>
          </div>
          <div className='radnik-div'>
            <h3>Lista zaposlenih:</h3>
            <ul>
              {employees.map((emp, index) => (
                <li key={index}>{`${emp.ime} ${emp.prezime} - ${emp.email}`}</li>
              ))}
            </ul>
          </div>
        </div>
      </form>

    </div>
  )
}

export default AddSalon