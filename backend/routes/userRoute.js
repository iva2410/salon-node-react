import express from 'express'
import { addFavoriteSalon, addRating, getComments, getFavoriteSalons, getProfile, listaTermina, loginUser, otkaziTretman, registerUser, termin, updateProfile, zakaziTretman } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/profile',authUser,getProfile)
userRouter.post('/update-profile',upload.array(),authUser,updateProfile)
userRouter.post('/zakazi-tretman',authUser,zakaziTretman)
userRouter.post('/otkazi-tretman',authUser,otkaziTretman)
userRouter.post('/omiljeni-saloni',authUser,addFavoriteSalon)
userRouter.get('/lista-omiljenih',authUser,getFavoriteSalons)
userRouter.post('/dodaj-ocenu',authUser,addRating)
userRouter.get('/termin/:terminId',authUser,termin)
userRouter.get('/lista-termina',authUser,listaTermina)
userRouter.get('/get-reviews',authUser,getComments)
export default userRouter