const { default: mongoose } = require('mongoose')
const b_Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler')

const b_createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await b_Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const b_updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const updatedCategory = await b_Category.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedCategory)

    } catch (error) {
        throw new Error(updateCategory)
    }
}

const b_deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const deletedCategory = await b_Category.findByIdAndDelete(id)
        res.json(deletedCategory)

    } catch (error) {
        throw new Error(error)
    }
}


const b_getCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const oneCategory = await b_Category.findById(id)
        res.json(oneCategory)

    } catch (error) {
        throw new Error(error)
    }
}

const b_getAllCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const allCategory = await b_Category.find({})
        res.json(allCategory)

    } catch (error) {
        throw new Error(error)
    }
}


module.exports = { b_createCategory, b_updateCategory, b_deleteCategory, b_getCategory, b_getAllCategory }