const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MOOGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Mongose Connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB