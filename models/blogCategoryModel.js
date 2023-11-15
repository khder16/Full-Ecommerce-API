const { string } = require('joi')
const mongoose = require('mongoose')



const b_productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
},
    { timestamps: true }
)


module.exports = mongoose.model('b_Category', b_productCategorySchema)