const express = require('express')
const router = express.Router()

const {register, verifyOtp, login, refreshToken} = require('../controllers/userController')

router.post('/register', register)
router.post('/verify-otp', verifyOtp) 
router.post('/login', login)
router.post('/refresh-token', refreshToken)

module.exports = router