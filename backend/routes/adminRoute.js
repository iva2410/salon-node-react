import express from 'express'
import { addRadnik, addRadnikSalon, addSalon, adminDashboard, allSalons, deleteRadnik, deleteSalon, listaTerminaAdmin, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter=express.Router()

adminRouter.post('/add-salon',authAdmin,upload.array('image',10),addSalon)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/add-radnik',authAdmin,upload.array(),addRadnik)
adminRouter.post('/add-radnik-salon',authAdmin,upload.array(), addRadnikSalon)
adminRouter.get('/all-salons',authAdmin,allSalons)
adminRouter.get('/lista-termina',authAdmin,listaTerminaAdmin)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.delete('/obrisi-salon/:salonId',authAdmin,deleteSalon)
adminRouter.delete('/obrisi-radnika/:radnikId',authAdmin,deleteRadnik)
export default adminRouter