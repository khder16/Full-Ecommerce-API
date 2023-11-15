const e = require('express')
const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    role: { type:String, default:'admin',validate: {
        validator: function(v) {
            return v === 'admin'
        },
        message: props => `${props.value} is not a valid role. Only 'admin' is allowed.`
    }}
})


module.exports = mongoose.model('Admin2', adminSchema)