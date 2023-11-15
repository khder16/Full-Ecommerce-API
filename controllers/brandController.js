const { default: mongoose } = require('mongoose')
const Brand = require('../models/BrandModel')
const asyncHandler = require('express-async-handler')

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBrand = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedBrand)

    } catch (error) {
        throw new Error(updateBrand)
    }
}

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)

    } catch (error) {
        throw new Error(error)
    }
}


const getBrand = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const oneBrand = await Brand.findById(id)
        res.json(oneBrand)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllBrand = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const allBrand = await Brand.find({})
        res.json(allBrand)

    } catch (error) {
        throw new Error(error)
    }
}


module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }