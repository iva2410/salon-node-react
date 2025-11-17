import express from 'express'
import { allComments, lista, listaTerminaRadnik, loginRadnik, otkazivanjeTermina, potvrdaTermina, radnikDashboard, removeImage, salonRadnika, updateSalon } from '../controllers/radnikController.js'
import authRadnik from '../middlewares/authRadnik.js'
import upload from '../middlewares/multer.js'

const radnikRouter=express.Router()

radnikRouter.get('/radnici',lista)
radnikRouter.post('/login',loginRadnik)
radnikRouter.get('/termini',authRadnik,listaTerminaRadnik)
radnikRouter.post('/otkazi-termin',authRadnik,otkazivanjeTermina)
radnikRouter.post('/potvrdi-termin',authRadnik,potvrdaTermina)
radnikRouter.get('/radnik-dashboard',authRadnik,radnikDashboard)
radnikRouter.get('/radnik-salon',authRadnik,salonRadnika)
radnikRouter.post('/update-salon',authRadnik,upload.array('image',10),updateSalon)
radnikRouter.post('/delete-image',authRadnik,removeImage)
radnikRouter.get('/get-comments',authRadnik,allComments)
export default radnikRouter