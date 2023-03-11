const {_Order, _Inventories, _Product} = require('../../models/ecommerceModel')

const orderProduct = async (req, res, next) => {
    try {
        const {userId, productId, shipment, payment, quantity, price, name} = req.body

        // Check quantity product in Inventory
        const productInventory = await _Inventories.findOneAndUpdate({
            productId,
            quantity: {$gt: quantity}
        }, {
            $inc: { // Increament quantity product
                quantity: -quantity
            }, 
            $push: { // Push User ordered product into Inventory
                reservation: {
                    userId,
                    quantity,
                    productId
                }
            }
        })
        // If there are enough goods, proceed to create orders for customers
        if (productInventory) {
            const newOrder = await _Order.create({
                userId, shipment, payment, 
                products: {
                    productId, name, price, quantity
                }
            })
    
            if (newOrder) {
                res.status(201).json(newOrder)
            } else {
                res.status(500)
            }
        }
        // Else return message
        else {
            await _Product.findOneAndUpdate({
                productId
            }, {
                active: false
            }, {
                upsert: true,
                new: true
            })

            res.status(500).json({
                message: 'Sell out!'
            })
        }
    } catch (error) {
        next(error)
    }
}

// const cancelOrderProduct = async (req, res, next) => {
//     try {
//         const {userId, productId, quantity} = req.body

//         const cancelProduct = await _Cart.findByIdAndUpdate({
//             userId,
//             products: {
//                 $elemMatch: {
//                     productId: productId
//                 }
//             }
//         }, {
//             $inc: {
//                 quantity: +quantity
//             },
//             $pullAll: {
//                 products: {
//                     $elemMatch: {
//                         productId: productId
//                     }
//                 }
//             }
//         }, {
//             upsert: true,
//             new: true
//         })

//         res.status(200).json({
//             message: 'test'
//         })

//     } catch (error) {
//         next(error)
//     }
// }


module.exports = {
    orderProduct
}