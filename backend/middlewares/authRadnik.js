import jwt from 'jsonwebtoken'

const authRadnik = async (req, res, next) => {
    try {

        const {  rtoken } = req.headers
        if (!rtoken) {
            return res.json({ success: false, message: "Niste autorizovani!" })
        }
        const token_decode = jwt.verify(rtoken, process.env.JWT_SECRET)
        req.body.radnikId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authRadnik