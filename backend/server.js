import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import adminRouter from './routes/adminRoute.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import salonRouter from './routes/salonRoute.js'
import radnikRouter from './routes/radnikRoute.js'
import { updateCompletedTretmani } from './controllers/salonController.js'
//app config
const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()


updateCompletedTretmani();

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/saloni',salonRouter)
app.use('/api/radnici',radnikRouter)


app.get('/',(req,res)=>{
    res.send('RADI')
})

app.listen(port,()=>console.log("radi",port))