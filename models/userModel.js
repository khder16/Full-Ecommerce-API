const e = require('express')
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    role: {
        type: String, default: 'user', validate: {
            validator: function (v) {
                return v === 'user'
            },
            message: props => `${props.value} is not a valid role. Only 'user' is allowed.`
        }
    },
    // mobile: {
    //     type: String 
    // },
    isBlocked: {
        type: Boolean
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String
    },
    wishlist: [{
        type: ObjectId,
        ref: "product"
    }],
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { //add created at , updated at
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

module.exports = mongoose.model("User2", userSchema)
