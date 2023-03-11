const express = require('express')
const router = express.Router()

const {listPaginBucket, createComment, insertBucketFromApi} = require('../controllers/bucketController')
const {verifyAccessToken} = require('../services/tokenService')

router.get('/list', listPaginBucket)
router.get('/insert', insertBucketFromApi)

router.post('/comment', createComment)

module.exports = router