const express = require('express')
const cors = require('cors') 
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./helper/connectDB')
const multer = require('multer')
const fileUpload = require('express-fileupload')
require('./helper/connectRedis')

const app = express()

dotenv.config()
const PORT = process.env.PORT || 8000

// Connect DB
connectDB()

// Midlle ware
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'uploads/'
}));

app.use('/api/user', require('./routes/userRoute'))
app.use('/api/bucket', require('./routes/bucketRoute'))
app.use('/api', require('./routes/ecommerceRoute'))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
