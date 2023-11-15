const { default: mongoose } = require('mongoose')
const Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updatedCategory)

    } catch (error) {
        throw new Error(updateCategory)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const deletedCategory = await Category.findByIdAndDelete(id)
        res.json(deletedCategory)

    } catch (error) {
        throw new Error(error)
    }
}


const getCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const oneCategory = await Category.findById(id)
        res.json(oneCategory)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllCategory = async (req, res) => {
    try {
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const allCategory = await Category.find({})
        res.json(allCategory)

    } catch (error) {
        throw new Error(error)
    }
}


module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory }