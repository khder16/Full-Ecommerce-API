const { default: mongoose } = require('mongoose')
const Coupon = require('../models/couponModel')


const createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
}


const getAllCoupon = async (req, res) => {
    try {
        const allCoupon = await Coupon.find({})
        res.json(allCoupon)
    } catch (error) {
        throw new Error(error)
    }
}


const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedCoupon)
    } catch (error) {
        throw new Error(error)
    }
}


const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const deletedCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deletedCoupon)
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon }