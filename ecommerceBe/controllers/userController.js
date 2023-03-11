const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../services/tokenService')
const {registerService, verifyOtpService, loginService} = require('../services/userService')

const register = async (req, res, next) => {
    try {
        const {email, password, fullname} = req.body
        console.log(email)
        const {code, message, elements} = await registerService({email, password, fullname})

        return res.status(code).json({
            code, message, elements
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const verifyOtp = async (req, res, next) => {
    try {
        const {email, roles = 'User', otp} = req.body
        const {code, elements, message} = await verifyOtpService({otp, email, roles})

        return res.status(code).json({
            code, message
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const {code, message, user} = await loginService({email, password})

        if (code === 200) {
            const refresh = await signRefreshToken(user._id, user.roles)
            res.cookie('jwt', refresh, {httpOnly: true, maxAge: 24 * 60 * 60 * 100})
            res.status(200).json({
                token: await signAccessToken(user._id, user.roles),
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                }
            })
            
        }
        else {
            res.status(code).json({
                code,
                message
            })
        }

    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refresh = req.cookies.jwt
        if (!refresh) {
            return res.status(500).json({
                code: 404,
                message: 'Missing value'
            })
        }
        const {userId, roles} = await verifyRefreshToken(refresh)
        if (userId) {
            const access = await signAccessToken(userId, roles)
            return res.status(200).json({
                access
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register, 
    verifyOtp, 
    login, 
    refreshToken
}