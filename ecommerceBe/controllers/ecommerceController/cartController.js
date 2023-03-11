const {_Cart} = require('../../models/ecommerceModel')


const addCart = async (req, res, next) => {
    try {
        const {userId, productId, name, price, quantity, image_url} = req.body
        // Check product already Exists in Cart. If exists, increase the number of products 
        const productCart = await _Cart.findOne({
            userId,
            products: {
                $elemMatch: {
                    productId: productId
                }
            }
        })
        if (productCart) {
            const updateProductCart = await _Cart.updateOne({
                userId,
                products: {
                    $elemMatch: {
                        productId: productId
                    }
                }
            }, {
                $inc: {
                    'products.$.quantity': +quantity
                }
            }, {
                upsert: true,
                new: true
            })
            res.status(201).json(updateProductCart)
        }
        // Else create new Product in cart
        else {
            const createProductCart = await _Cart.findOneAndUpdate({
                userId
            }, {
                $push: {
                    products: {
                        productId, name, price, quantity, image_url
                    }
                }
            }, {
                upsert: true,
                new: true
            })
            return res.status(201).json(createProductCart)
        }
        
    } catch (error) {
        next(error)
    }
}

const removeProductInCart = async (req, res, next) => {
    try {
        const {productId, userId} = req.body

        const product = await _Cart.updateOne({
            userId
        }, {
            $pull: {
                products: {
                    productId: productId
                }
            }
        }, {
            upsert: true,
            new: true
        })

        if (product) {
            res.status(201).json(product)
        }
    } catch (error) {
        next(error)
    }
}

const listProductInCart = async (req, res, next) => {
    try {
        const {userId} = req.params
        if (!userId) {
            return res.status(401).json({
                message: 'UnAuthorization!'
            })
        }

        const list = await _Cart.findOne({
            userId
        })

        if (list) {
            res.status(200).json(list)
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

module.exports = {
    addCart,
    removeProductInCart,
    listProductInCart
}