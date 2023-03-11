const JWT = require('jsonwebtoken')
const createError = require('http-errors')

const client = require('../helper/connectRedis')

const signAccessToken = async (userId, roles) => {
    return new Promise( (resolve, reject) => {
        const payload = { userId, roles }
        const secret = process.env.SECRET_ACCESS_TOKEN
        const options = { expiresIn: '300s'}

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}


// const verifyAccessToken = async (req, res, next) => {
//     if (!req.headers['authorization']) {
//         return res.json(createError.Unauthorized())
//     }
//     const authHeader = req.headers['authorization']
//     const bearToken = authHeader.split(' ')
//     const token = bearToken[1]

//     // Start verify
//     JWT.verify(token, process.env.ACCESS_TOKEN_SERCET, (err, payload) => {
//         if (err) {
//             if (err.name === 'JsonWebTokenError') {
//                 return next(createError.Unauthorized())
//             }
//             return next(createError.Unauthorized(err.message))
//         }
//         req.payload = payload
//         next()
//     })
// }


const verifyAccessToken = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({
            message: 'AnAuthorization!'
        })
    }
    const authHeader = req.headers['authorization']
    const bearToken = authHeader.split(' ')
    const token = bearToken[1]
    JWT.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decode) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized())
            }
            return next(createError.Unauthorized(err.message))
        }
        req.payload = decode
        next()
    })
}

const signRefreshToken = async (userId, roles) => {
    return new Promise( (resolve, reject) => {
        const payload = { userId, roles }
        const secret = process.env.SECRET_REFRESH_TOKEN
        const options = {  expiresIn: '1d' }

        JWT.sign(payload, secret, options, (err, refresh) => {
            if (err) reject(err)
            client.set(userId.toString(), refresh, 'EX', 15 * 24 * 60 * 60, (err, reply) => {
                if (err) return reject(createError.InternalServerError())
                resolve(refresh)
            })
        })
    })
}

const verifyRefreshToken = async (refresh) => {
    return new Promise( (resolve, reject) => {
        JWT.verify(refresh, process.env.SECRET_REFRESH_TOKEN, (err, decode) => {
            if (err) reject(err)
            client.get(decode.userId, (err, reply) => {
                if (err) return reject(createError.InternalServerError)
                if (refresh === reply) return resolve(decode)
                return reject(createError.Unauthorized())
            })
        })
    })
}

module.exports = {
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken,
    verifyAccessToken
}