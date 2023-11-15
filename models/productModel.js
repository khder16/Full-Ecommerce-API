const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    quantity: {
        type: Number,
        required: true
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        required: true
    },
    ratings: [{
        star: Number,
        comment: String,
        postedby: { type: ObjectId, ref: "User2" }
    }],
    totalRating: {
        type: String,
        default: 0
    }
}, {
    timestamps: false
})

module.exports = mongoose.model("product", productSchema)