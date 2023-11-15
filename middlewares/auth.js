const jwt = require('jsonwebtoken')
const config = process.env
const cookieParser = require('cookie-parser')
const User2 = require('../models/userModel')
const { Cookie } = require('express-session')
const verifyToken = async (req, res, next) => {
    const token = req.cookies.refreshToken || req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send("A token is required for authentication")
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY)

        var user = await User2.findById(decoded.id)
            req.user = user


    } catch (error) {
        return res.status(401).send("Invalid Token ")
    }
    return next()

}

const authRole = async (req, res, next) => {

    const User = req.user
    if (User.role != 'Admin') {
        return res.json({ err: "Admins Only" })
    }
    next()
}



module.exports = {  verifyToken, authRole }