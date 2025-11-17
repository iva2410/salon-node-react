import React, { useContext, useEffect, useState } from 'react'
import './Termini.css'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
const Termini = () => {
    const { naziv, usluga } = useParams()
    const { saloni, backendUrl, token, loadSaloni } = useContext(AppContext)
    const selectedServices = usluga.split(',');
    console.log(selectedServices);

    const [info, setInfo] = useState(null)
    const [cena, setCena] = useState(null)
    const [zaposleni, setZaposleni] = useState(false)
    const [selectZap, setSelectZap] = useState('')
    const [slots, setSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const navigate = useNavigate()
    const [radnikId, setRadnikId] = useState(null); 
    const [radnikSlot, setRadnikSlot] = useState('')
    const [startDate, setStartDate] = useState(new Date());
    const months = [
        "Januar", "Februar", "Mart", "April", "Maj",
        "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
    ];
    const daysOfWeek = ['NED', 'PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB']
    const dayToIndexMap = {
        nedelja: 0,
        ponedeljak: 1,
        utorak: 2,
        sreda: 3,
        četvrtak: 4,
        petak: 5,
        subota: 6,
    };

    const fetchInfo = async () => {
        const info = saloni.find(salon => salon.name === naziv)
        setInfo(info)

        if (info) {
            const prices = selectedServices.map((service) => {
                for (const item of info.usluge) {
                    const index = item.podtip.indexOf(service);
                    if (index !== -1) {
                        return item.cena[index]; 
                    }
                }
                return 'Cena nije pronađena'
            })

            setCena(prices); 
        }

    }
    const ukupnaCena = cena?.reduce((acc, price) => acc + price, 0);



    const dropDown = () => {
        setZaposleni(!zaposleni)
    }

    const selectZaposleni = (zap) => {
        setSelectZap(`${zap.ime} ${zap.prezime}`)
        setZaposleni(false)
        setRadnikId(zap._id)
        setRadnikSlot(zap)



    }
console.log(selectZap);


    const daysMapping = {
        "понедељак": "Ponedeljak",
        "уторак": "Utorak",
        "среда": "Sreda",
        "четвртак": "Četvrtak",
        "петак": "Petak",
        "субота": "Subota",
        "недеља": "Nedelja"
    };


    const getAvailableSlots = async () => {
        setSlots([])

        // let today = new Date()
        let currentDate = new Date(startDate);
        for (let i = 0; i < 7; i++) {
           
            const dayOfWeek = currentDate.toLocaleDateString('sr-RS', { weekday: 'long' });

            const mappedDayOfWeek = daysMapping[dayOfWeek] || dayOfWeek;
            const workTime = info.radnoVreme.find(day => day.dan === mappedDayOfWeek)?.vreme;
            // console.log("Naziv dana u petlji:", mappedDayOfWeek); 
            

            if (!workTime || workTime === "Zatvoreno") {
                console.log(`${mappedDayOfWeek}`);
                setSlots(prev => [...prev, { isClosed: true, day: mappedDayOfWeek }]);
                currentDate.setDate(currentDate.getDate() + 1);
                continue;

            }

            let [start, end] = workTime.split(" - ");
            let [startHour, startMinute] = start.split(":").map(Number);
            let [endHour, endMinute] = end.split(":").map(Number);

            currentDate.setHours(startHour, startMinute, 0, 0);
            let endTime = new Date(currentDate);
            endTime.setHours(endHour, endMinute, 0, 0);
            let today = new Date()
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(today.getHours() >= startHour ? today.getHours() + 1 : startHour)
                currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0)
            }

            let timeSlots = []

            while (currentDate < endTime) {

                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + '_' + month + '_' + year
                //const slotTime = formattedTime
                // const isSlotAvailable = radnikSlot.slots_booked[slotDate] && radnikSlot.slots_booked[slotDate].includes(slotTime) ? false : true;
                const isSlotAvailable = radnikSlot.slots_booked &&
                    radnikSlot.slots_booked[slotDate] &&
                    radnikSlot.slots_booked[slotDate].includes(formattedTime)
                    ? false : true;


                //const isSlotAvailable = radnikSlot.slots_booked[slotDate] && radnikSlot.slots_booked[slotDate].includes(slotTime) ? false : true
                // const isSlotAvailable = radnikSlot?.slots_booked?.[slotDate] && 
                //!radnikSlot.slots_booked[slotDate].includes(slotTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }


                currentDate.setMinutes(currentDate.getMinutes() + 30)

            }
            setSlots(prev => ([...prev, timeSlots]))
            currentDate.setDate(currentDate.getDate() + 1);
        }

    }
    const handlePrevWeek = () => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const formatDate = (date) => {
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${year}`;
    };


    const zakaziTretman = async () => {
        if (!token) {
            toast.warn('Prijavite se')
            return navigate('/login')
        }

        try {
            const date = slots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year
            console.log(slotDate);

            const { data } = await axios.post(backendUrl + '/api/user/zakazi-tretman', { radnikId, slotDate, slotTime, naziv, usluga:selectedServices, cena }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                loadSaloni()
                getAvailableSlots()

                navigate('/moji-termini')

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }
    useEffect(() => {
        if (radnikSlot) {
            getAvailableSlots();
        }
    }, [radnikSlot, startDate])
    useEffect(() => {
        fetchInfo()
    }, [saloni])


    useEffect(() => {
        console.log(slots);

    }, [slots])

    useEffect(() => {
        if (info && info.zaposleni && info.zaposleni.length > 0) {
            const defaultZaposleni = info.zaposleni[0];
            //setSelectZap(`${defaultZaposleni.ime} ${defaultZaposleni.prezime}`);
            setRadnikSlot({ ...defaultZaposleni, slots_booked: defaultZaposleni.slots_booked || {} });
        }
    }, [info]);



    return info && (
        <div className='glavni'>
            <div className='div-left'>
                <div className='div-info'>
                    <p className='naziv'>{naziv}</p>
                    <p className='info'>{info.informacije}</p>
                </div>
                <div className='div-usluga'>
                    <div className='div-jedan'>
                        {cena.map((price, index) => (
                            <div className='div-usluga-jedan' key={index}>
                                <p>Usluga: {selectedServices[index]}</p>
                                <p>{price} RSD</p>
                            </div>
                        ))}
                    </div>
                    <div className='div-usluga-dva'>
                        <p>Ukupno:</p>
                        <p>{ukupnaCena} RSD</p>
                    </div>

                    <div className='zaposleni'>

                        <button className='btn-zap' onClick={dropDown}><p><img className='people' src={assets.upload_area} alt="" />    {selectZap ? `${selectZap}` : 'Izaberite zaposlenog'}
                        </p> <p><img src={assets.dropdown_icon} alt="" /></p> </button>

                        {
                            zaposleni && (
                                <div className='dropdown'>
                                    <ul>
                                        {
                                            info.zaposleni.map((item, index) => (
                                                <li key={item._id} onClick={() => selectZaposleni(item)}>{item.ime} {item.prezime}</li>
                                            ))
                                        }
                                    </ul>
                                </div>

                            )
                        }

                    </div>
                </div>
            </div>
            <div className="right-div">
                <p className='naziv'>Izaberite odgovarajući termin</p>

                <p className='naziv-mesec'> {formatDate(startDate)}</p>
                <div className='calendar'>
                    <button onClick={handlePrevWeek}><span className="mdi mdi-arrow-left-bold"></span></button>

                    {
                        slots.length > 0 ? (
                            slots.map((item, index) => (
                                <div
                                    className={`table ${slotIndex === index ? 'aktivan' : ''} ${item.isClosed ? 'zatvoreno' : ''}`}
                                    onClick={() => !item.isClosed && setSlotIndex(index)} 
                                    key={index}
                                >
                                    {Array.isArray(item) && item.length > 0 ? ( 
                                        <>
                                            <p className='dan'>{daysOfWeek[item[0].datetime.getDay()]}</p>
                                            <p className='datum'>{item[0].datetime.getDate()}</p>
                                        </>
                                    ) : (
                                        <p className='zatvoreno'>
                                            {item.day && daysOfWeek[dayToIndexMap[item.day.toLowerCase()]]}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p> </p>
                        )
                    }
                    <button onClick={handleNextWeek}><span className="mdi mdi-arrow-right-bold"></span></button>

                </div>
                <div className='slots'>
                    {Array.isArray(slots[slotIndex]) && slots[slotIndex].map((item, index) => (
                        <p
                            className={`${item.time === slotTime ? 'oznacen' : ''}`}
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={zakaziTretman} className='zakazi'>Zakažite tretman</button>
            </div>
        </div>
    )
}

export default Termini