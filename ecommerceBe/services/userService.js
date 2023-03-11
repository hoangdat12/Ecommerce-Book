const _User = require('../models/userModel')
const _Otp = require('../models/optModel')
const OtpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')

// const {signAccessToken, signRefreshToken} = require('../services/tokenService')
const {insertOtpService, validOtpService} = require('../services/optService')
const sendEmail = require('../helper/sendEmail')

const registerService = async ({email, password, fullname}) => {
    const user = await _User.findOne({email})

    if (user) {
        return {
            code: 400,
            message: 'This email is already in user!'
        }
    }

    const OTP = OtpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })

    sendEmail(email, OTP)

    console.log('otp is: ', OTP)

    return {
        code: 200,
        elements: await insertOtpService({otp: OTP, email, password, fullname})
    }
}

const verifyOtpService = async ({otp, email, roles}) => {
    try {
        const optHolder = await _Otp.find({
            email
        })
        // OTP return array because we are select latest otp to handle
        if (!optHolder.length) {
            return {
                code: 404,
                message: 'Expired OTP!'
            }
        }
        const lastOTP = optHolder[optHolder.length - 1]
        const isValid = await validOtpService({otp, hashOtp: lastOTP.otp})
        if (!isValid) {
            return {
                code: 401,
                message: 'Invalid OTP!'
            }
        }
        if (isValid && email === lastOTP.email) {
            const hashPassword = await bcrypt.hash(lastOTP.password, 10)
            const user = await _User.create({
                email,
                password: hashPassword,
                fullname: lastOTP.fullname,
                roles
            })

            if (user) {
                // delete many OTP in database
                await _Otp.deleteMany({
                    email
                })
            }
            return {
                code: 201,
                // after return token
                message: 'success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const loginService = async ({email, password}) => {
    if (!email || !password) {
        return ({
            code: 404,
            message: 'Missing email or password!'
        })
    }

    const user = await _User.findOne({email})

    if (!user) {
        return ({
            code: 404,
            message: `Email don't match with any User in System!`
        })
    }

    const isValid = await bcrypt.compare(password, user.password)
    console.log(isValid)
    if (!isValid) {
        return {
            code: 404,
            message: 'Password is wrong!'
        }
    }

    return {
        code : 200,
        user: user
    }
}

module.exports = {
    registerService,
    verifyOtpService,
    loginService,
}