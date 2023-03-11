const {_Inventories} = require('../../models/ecommerceModel')


const addInventory = async (req, res, next) => {
    try {
        const {productId, quantity} = req.body

        // Check product already exists in Inventory. If exists, return message
        const isExist = await _Inventories.findOne({productId}).exec()
        if (isExist) {
            return res.status(400).json({
                message: 'The product already exists in the store!'
            })
        }
        // Esle create new Product in Inventory
        const newProductInInventory = await _Inventories.create({
            productId, quantity
        })

        if (newProductInInventory) {
            res.status(201).json(newProductInInventory)
        } else {
            res.status(500)
        }

    } catch (error) {
        next(error)
    }
}

const updateQuanlityInventory = async (req, res, next) => {
    try {
        const {productId, quantity} = req.body
        const productInStock = await _Inventories.updateOne({
            productId
        }, {
            $set: {
                quantity: quantity
            }
        }, {
            upsert: true,
            new: true
        })

        if(productInStock) {
            res.status(201).json(productInStock)
        } else {
            res.status(500)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addInventory, 
    updateQuanlityInventory
}
