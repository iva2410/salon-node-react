import express from 'express'
import { allComments, salonList } from '../controllers/salonController.js'

const salonRouter=express.Router()
salonRouter.get('/saloni',salonList)
salonRouter.get('/utisci',allComments)

export default salonRouter