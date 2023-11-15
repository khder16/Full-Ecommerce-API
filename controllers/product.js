const { json } = require('body-parser')
const product = require('../models/productModel')
const slugify = require('slugify')
const mongoose = require('mongoose')
const User2 = require('../models/userModel')
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')
const createProduct = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(updatedProduct)
    } catch (error) {
        throw new Error(error)
    }
}

const getProduct = async (req, res) => {
    try {
        const findProduct = await product.findById(req.params.id, { _id: 0, __v: 0, "ratings._id": 0, "ratings.postedby": 0 })
        if (!findProduct) {
            return res.json({ msg: "Can't Find This Products" })
        }
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllProduct = async (req, res) => {
    try {

        // Filtering
        const queryObj = { ...req.query }
        const excludeFields = ["page", "sort", "limit", "Filds"]
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)


        //pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        if (req.query.page) {
            const productCount = await product.countDocuments()
            if (skip >= productCount) {
                throw new Error("This Page does not exists")
            }
            console.log(productCount)
        }
        let query,
            sortBy = req.query.sort
        sortOptions = {
            price: { price: -1 },
            rating: { "ratings.star": -1 },
            sold: { sold: -1 }
        }

        if (sortBy) {
            const sortCriteria = sortBy.split(',').map((option) => sortOptions[option]).filter((criteria) => !!criteria);
            const finalSort = Object.assign({}, ...sortCriteria);
            query = await product.find(JSON.parse(queryStr)).sort(finalSort).select("-_id -ratings.postedby -ratings._id -__v").skip(skip).limit(limit)


        }
        // Limiting the filds
        if (req.query.fields) {
            const fields = req.query.fields;
            

            let rr = await product.find(JSON.parse(queryStr)).select({ "_id": false });
            res.json(rr)

        }
        else {
            query = await product.find(JSON.parse(queryStr)).select("-ratings.postedby -ratings._id -__v").skip(skip).limit(limit)
        }
        res.json(query)


    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await product.findByIdAndDelete(req.params.id)
        res.json(deletedProduct)
    } catch (error) {
        throw new Error(error)
    }
}


const filterProduct = async (req, res) => {
    const { minprice, maxprice, color, category, availablity, brand } = req.params
    console.log(req.query)
    try {
        const filterProduct = await product.find({
            price: {
                $gte: minprice,
                $lte: maxprice
            },
            brand,
            category,
            color,
        })
        res.json(filterProduct)
    } catch (error) {
        throw new Error(error)
    }
    res.json({ minprice, maxprice, color, category, availablity, brand })
}


const addToWishlist = async (req, res) => {
    try {
        const { _id } = req.user
        const { prodId } = req.body

        const user = await User2.findById(_id)
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyadded) {
            let user = await User2.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            },
                { new: true }
            )
            res.json(user)
        } else {
            let user = await User2.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            },
                { new: true }
            )
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
}


const rating = async (req, res) => {
    try {
        const { _id } = req.user
        const { star, prodId, comment } = req.body
        mongoose.Types.ObjectId.isValid(prodId)
        const product1 = await product.findById(prodId)
        let alreadyRated = product1.ratings.find((userId) => userId.postedby.toString() === _id.toString())

        if (alreadyRated) {
            const updateRating = await product.updateOne({
                "ratings.postedby": _id
            },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                },
                {
                    new: true
                })


        } else {
            const rateProduct = await product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id
                    }
                }
            }, { new: true })
            
        }
        const getallratings = await product.findById(prodId)
        let totalRating = getallratings.ratings.length
        let ratingsum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)
        let actualRating = Math.round(ratingsum / totalRating)
        let finalproduct = await product.findByIdAndUpdate(prodId, {
            totalRating: actualRating,
        },
            {
                new: true
            })
        res.json(totalRating)


    } catch (error) {
        console.log(error)
    }
}


const uploadImages = async (req, res) => {
    try {

        //    console.log(req.files);
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files
        for (const file of files) {
            const { path } = file
            const newPath = await uploader(path)
            console.log(newPath);
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const findProduct = await product.findByIdAndUpdate(id, { images: urls.map((file) => { return file }) }, { new: true })
        res.json(findProduct)
    } catch (error) {

    }
}




module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages }