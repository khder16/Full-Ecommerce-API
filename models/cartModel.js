const { ObjectId } = require('mongodb');
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "product"
            },
            count: Number,
            color: String,
            price: Number,

        }
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: ObjectId,
        ref: "User2"
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Cart', cartSchema);