const mongoose = require('mongoose')

const optSchema = new mongoose.Schema({
    email: String,
    password: String,
    fullname: String,
    otp: String,
    time: {type: Date, default: Date.now(), index: {expires: 300}}
}, {
    collection: 'otp'
})

module.exports = mongoose.model('Otp', optSchema)