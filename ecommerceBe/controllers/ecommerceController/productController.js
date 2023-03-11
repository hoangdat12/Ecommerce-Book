const {_Product} = require('../../models/ecommerceModel')

const {insertBucketService} = require('../../services/bucketService')

const createProduct = async (req, res, next) => {
    try {
        const {name, code, author, description, release, price, type, supelier, translator, publishingCompany, languae, weight, pages, layout, bucketId, image_url} = req.body
        // Check the product already exists. If exists, return message
        const product = await _Product.findOne({name, author}).exec()
        if (product) {
            return res.status(400).json({
                message: 'The product already exists in the store!'
            })
        }
        // Else create new Product
        const newProduct = await _Product.create({
            name, code, author, description, release, price, type, supelier, translator, publishingCompany, languae, weight, pages, layout, image_url
        })

        await insertBucketService({name, code, author, description, release, price, type, supelier, translator, publishingCompany, languae, weight, pages, layout, bucketId, productId: newProduct._id, image_url})

        res.status(201).json(newProduct)
    } catch (error) {
        next(error)
    }
}

const getAllProduct = async (req, res, next) => {
    try {
        const products = await _Product.find()

        if (products) {
            res.status(200).json(products)
        } else {
            res.status(500).json({
                message: 'Error'
            })
        }

    } catch (error) {
        next(error)
    }
}

const detailProduct = async (req, res, next) => {
    try {
        const {productId} = req.params

        const product = await _Product.findOne({_id : productId}).lean()

        if (product) {
            res.status(200).json(product)
        } else {
            res.status(500)
        }

    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const {productId} = req.params
        const update = req.body

        const product = await _Product.findOneAndUpdate({
            productId
        }, {
            update
        }, {
            upsert: true,
            new: true
        })

        if (product) {
            res.status(201).json(product)
        } else {
            res.status(500)
        }

    } catch (error) {
        next(error)
    }
}

const searchProduct = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.quary.search || ""
        
        const product = await _Product.find(({
            name: {$regex: search, $options: "i"}
        })).skip(page * limit).limit(limit)

        console.log(product)

        if (product) {
            res.status(200).json({
                product
            })
        } else {
            res.status(500).json({
                message: 'Error server!'
            })
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Trend Product Test 
const trendProduct = async (req, res, next) => {
    try {
        const products = await _Product.find().limit(40)

        if (products) {
            res.status(200).json(products.slice(15,23))
        } else {
            res.status(500).json({message: 'Error sever!'})
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const saleProduct = async (req, res, next) => {
    try {
        const products = await _Product.find().limit(40)

        if (products) {
            res.status(200).json(products.slice(23,27))
        } else {
            res.status(500).json({message: 'Error sever!'})
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Get Product by type
const getProductByType = async (req, res, next) => {
    const {type} = req.query
    if (!type) {
        return res.status(400).json({
            message: 'Missing type!'
        })
    }
    const products = await _Product.find({ type : { $all : [type] } })
    if (!products) {
        return res.status(500).json({
            message: 'Server Error!'
        })
    }
    res.status(200).json(products)
}

module.exports = {
    createProduct,
    detailProduct,
    updateProduct,
    searchProduct,
    getAllProduct,
    trendProduct,
    saleProduct,
    getProductByType
}