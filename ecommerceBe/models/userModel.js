const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'User',
    timestamps: true
})

// Middle ware
userSchema.method.isCheckPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoose.model('User', userSchema)
