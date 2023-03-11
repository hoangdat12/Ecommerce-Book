const {Schema, model} = require('mongoose')

// Product
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: String,
    author: String,
    supelier: String,
    type: Array,
    price: Number,
    translator: String,
    publishingCompany: String,
    languae: String,
    weight: Number,
    pages: Number,
    layout: String,
    description: String,
    release: String,
    image: {
        data: Buffer,
        contentType: String
    },
    image_url: String,
    active: {
        type: Boolean,
        default: true
    },
    specs: [{
        type: Array,
        default: []
    }]
}, {
    collection: 'Product',
    timestamps: true
})

// Cart
const CartSchema = new Schema({
    userId: String,
    status: {
        type: String, 
        default: 'active'
    },
    modifyOn: {
        type: Date, 
        default: Date.now()
    },
    products: Array
}, {
    collection: 'Cart',
    timestamps: true
})


// Order
const OrderSchema = new Schema({
    userId: String,
    shipping: Object,
    payment: Object,
    products: Array
}, {
    collection: 'Order',
    timestamps: true
})


// Inventory
const InventorySchema = new Schema({
    productId: String,
    quantity: Number,
    reservation: Array
}, {
    collection: 'Inventories',
    timestamps: true
})

module.exports = {
    _Product: model('Product', ProductSchema),
    _Cart: model('Cart', CartSchema),
    _Order: model('Order', OrderSchema),
    _Inventories: model('Inventories', InventorySchema),
}