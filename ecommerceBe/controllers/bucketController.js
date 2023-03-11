const _Bucket = require('../models/bucketsModel')
const {_Product} = require('../models/ecommerceModel')

const {listPaging, insertCommentService, insertBucketServiceFromApi} = require('../services/bucketService')

const listPaginBucket = async (req, res) => {
    try {
        const {bucketId, page, pageSize} = req.query
        res.status(200).json({
            status: 'success',
            products: await listPaging({bucketId, page, pageSize}),
            meta: {
                pageSize,
                page
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'error sever'})
    }
}

const insertBucketFromApi = async (req, res, next) => {
    try {
        const products = await _Product.find()
        const newArr = products.map(product => {
            const {_id, name, code, author, description, release, price, type, supelier, translator, publishingCompany, languae, weight, pages, layout, image_url} = product
            return {productId: _id, name, code, author, description, release, price, type, supelier, translator, publishingCompany, languae, weight, pages, layout, image_url}
        })

        newArr.map(async (arr) => await insertBucketServiceFromApi(arr))

        res.status(200).json({message: 'Ok!'})

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const createComment = async (req, res, next) => {
    try {
        const {productId, fullname, content } = req.body

        const product = await _Product.find({productId}).exec()
        if (product) {
            const {code, message} = await insertCommentService({productId, fullname, content})
            res.status(code).json({
                message
            })
        } else {
            res.status(400).json({
                message: 'Product not Exists!'
            })
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    listPaginBucket, createComment, insertBucketFromApi
}