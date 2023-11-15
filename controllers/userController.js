const User2 = require("../models/userModel");
const Admin2 = require("../models/adminModel");
const product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')
const { verifyToken, authRole } = require('../middlewares/auth');
const mongoose = require("mongoose");
const session = require('express-session')
const Joi = require('joi')
//register for user
const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const resault = await authSchema.validateAsync(req.body)
        if (!(first_name && last_name && email && password)) {
            return res.status(400).send("All input is required");
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password less than 6 characters" })
        }
        const oldUser = await User2.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User is already Exist. Please login");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User2.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "user",
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "10d",
            }
        );

        user.token = token;

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};

//register for admin
const registerAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        const resault = await authSchema.validateAsync(req.body)

        if (!(first_name && last_name && email && password)) {
            return res.status(400).send("All input is required");
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password less than 6 characters" })
        }
        const oldAdmin = await User2.findOne({ email });

        if (oldAdmin) {
            return res.status(409).send("Admin is already Exist. Please login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin2.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: "admin",
        });

        const token = jwt.sign(
            { admin_id: admin._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "10d",
            }
        );

        admin.token = token;

        res.status(200).json(admin);
    } catch (error) {
        console.log(error);
    }
};

const getAllAdmins = async (req, res) => {
    try {
        verifyToken(req, res, async () => {
            const allAdmins = await Admin2.find({})
            res.send(allAdmins)
        })

    } catch (error) {
        console.log(error)
    }
}

const getAllUsers = async (req, res) => {
    try {
        verifyToken(req, res, async () => {
            const allUsers = await User2.find({})
            res.send(allUsers)
        })
    } catch (error) {
        console.log(error)
    }
}


// save user Address

const svaeAddress = async (req, res) => {
    try {
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const updateAddress = await User2.findByIdAndUpdate(_id, {
            address: req?.body?.address
        },
            { new: true }
        )
        res.json(updateAddress)
    } catch (error) {
        throw new Error(error)
    }
}


const updateUser = async (req, res) => {
    const user = await User2.findOne({ _id: req.body._id })
    mongoose.Types.ObjectId.isValid(user._id)
    try {
        const newUser = await User2.findByIdAndUpdate({ _id: user._id }, { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, mobile: req.body.mobile }
            , { new: true })
        res.json(newUser)

    } catch (error) {
        throw new Error(error)
    }
}

const blockUser = async (req, res) => {
    const user = await User2.findOne({ _id: req.body._id })
    mongoose.Types.ObjectId.isValid(user._id)
    try {
        const block = await User2.findByIdAndUpdate({ _id: user._id }, {
            isBlocked: true
        },
            { new: true })
        res.json({ msg: "User blocked" })
    } catch (error) {
        throw new Error(error)
    }
}

const unblockUser = async (req, res) => {
    const user = await User2.findOne({ _id: req.body._id })
    mongoose.Types.ObjectId.isValid(user._id)
    try {
        const block = await User2.findByIdAndUpdate({ _id: user._id }, {
            isBlocked: false
        },
            { new: true })
        res.json({ msg: "User unblocked" })
    } catch (error) {
        throw new Error(error)
    }
}



const getUser = async (req, res) => {
    try {
        const oneUser = await User2.findById({ _id: req.body._id })
        mongoose.Types.ObjectId.isValid(oneUser._id)
        res.json({ oneUser })
    } catch (error) {
        throw new Error(error)
    }
}



const getWishlist = async (req, res) => {
    try {
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const findUesr = await User2.findById(_id).populate('wishlist')
        res.json(findUesr)
    } catch (error) {
        throw new Error(error)
    }
}

const userCart = async (req, res) => {
    try {
        const { cart } = req.body
        const { _id } = req.user
        let products = []
        mongoose.Types.ObjectId.isValid(_id)
        const user = await User2.findById(_id)
        const alreadyExistCart = await Cart.findOneAndRemove({ orderby: user._id })


        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await product.findById(cart[i]._id).select("price").exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }

        console.log(cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }
}

const getUserCart = async (req, res) => {
    try {
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
}


const emptyCart = async (req, res) => {
    try {
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const user = await User2.findOne({ _id })
        const cart = await Cart.findOneAndRemove({ orderby: user.id })
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
}

const applyCoupon = async (req, res) => {
    try {
        const { coupon } = req.body
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const validCoupon = await Coupon.findOne({ name: coupon })
        if (validCoupon === null) {
            throw new Error("Invalid Coupon")
        }
        const user = await User2.findOne({ _id })
        let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate("products.product")
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2)
        await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true })
        res.json(totalAfterDiscount)
    } catch (error) {
        throw new Error(error)
    }
}

const createOrder = async (req, res) => {
    try {
        const { COD, couponApplied } = req.body
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        if (!COD) {
            throw new Error("Create cash order failed")
        }
        const user = await User2.findById(_id)
        let userCart = await Cart.findOne({ orderby: user._id })
        // console.log(userCart);
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount
        } else {
            finalAmount = userCart.cartTotal
        }
        let newOrder = await Order.create({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd"
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery"
        })
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })
        const updated = await product.bulkWrite(update, {})
        console.log(newOrder);
        res.json({ message: "success" })
    } catch (error) {
        throw new Error(error)
    }
}



const getOrder = async (req, res) => {
    try {
        const { _id } = req.user
        mongoose.Types.ObjectId.isValid(_id)
        const userOrder = await Order.findOne({ orderby: _id }).populate('products.product').exec()
        res.json(userOrder)
    } catch (error) {
        throw new Error(error)
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const {orderStatus} = req.body
        const { id } = req.params
        mongoose.Types.ObjectId.isValid(id)
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            orderStatus, paymentIntent: {
                status: orderStatus,
            }
        }, { new: true })
        res.json(updatedOrder)
    } catch (error) {
        throw new Error(error)
    }
}



const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,20}$/),
    first_name: Joi.string().min(3).max(20).required(),
    last_name: Joi.string().min(3).max(20).required()
})



module.exports = {
    registerUser,
    registerAdmin,
    userCart,
    getAllAdmins,
    getAllUsers,
    updateUser,
    blockUser,
    svaeAddress,
    unblockUser,
    getUser,
    getWishlist,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    updateOrderStatus
};
