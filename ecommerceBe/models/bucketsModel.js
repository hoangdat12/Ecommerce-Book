const {Schema, model} = require('mongoose')

const bucketSchema = new Schema({
    bucketId: String,
    count: {type: Number, required: true},
    products: {
        type: Array,
        default: []
    }
}, {
    collection: 'Bucket',
    timestamps: true
})

const commentSchema = new Schema({
    productId: String,
    count: {type: Number, required: true},
    comments: {
        type: Array,
        default: []
    }
}, {
    collection: 'Comment',
    timestamps: true
})

module.exports = {
    _Bucket: model('Bucket', bucketSchema),
    _Comment: model('Comment', commentSchema)
}