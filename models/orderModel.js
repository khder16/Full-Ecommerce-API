const { ObjectId } = require('mongodb');
const mongoose = require('mongoose'); 


var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "product"
            },
            count: Number,
            color: String
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
    },
    orderby: {
        type: ObjectId,
        ref: "User2"
    }
},
    { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);