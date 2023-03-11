const express = require('express')
const router = express.Router()

const {
    createProduct, detailProduct, updateProduct, 
    searchProduct, getAllProduct, trendProduct,
    saleProduct, getProductByType
} = require('../controllers/ecommerceController/productController')
const {addCart, removeProductInCart, listProductInCart} = require('../controllers/ecommerceController/cartController')
const {orderProduct} = require('../controllers/ecommerceController/orderController')
const {addInventory, updateQuanlityInventory} = require('../controllers/ecommerceController/inventoryController')

router.post('/product/create', createProduct)
router.get('/product/detail/:productId', detailProduct)
router.get('/product/update/:productId', updateProduct)
router.get('/product', searchProduct)
router.get('/product/all', getAllProduct)
router.get('/product/trend', trendProduct)
router.get('/product/sale', saleProduct)
router.get('/product/get', getProductByType)

router.post('/cart/add', addCart)
router.post('/cart/remove', removeProductInCart)
router.get('/cart/list/:userId', listProductInCart)

router.post('/order/product', orderProduct)

router.post('/inventory/add', addInventory)
router.post('/inventory/update', updateQuanlityInventory)

module.exports = router
