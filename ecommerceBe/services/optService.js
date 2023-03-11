const bcrypt = require('bcrypt')
const _Opt = require('../models/optModel')

const insertOtpService = async ({otp, email, password, fullname}) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt)
        const Otp = await _Opt.create({
            email, password, fullname,
            otp: hashOtp
        })

        return Otp ? 1 : 0
    } catch (error) {
        console.log(error)
    }
}

const validOtpService = async ({
    otp, // Otp user send server
    hashOtp
}) => {
    try {
        const isValid = await bcrypt.compare(otp, hashOtp)
        return isValid
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    insertOtpService, validOtpService
}