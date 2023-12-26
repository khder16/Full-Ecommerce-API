const User2 = require("../models/userModel");
const Admin2 = require("../models/adminModel");
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const sendEmail = require('../controllers/emailNode')
const generateRefreshToken = require('../config/refreshToken')
const updateUser = require('../controllers/userController');
const { default: mongoose } = require("mongoose");
const { error } = require("winston");

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Enter email and password");
        }

        let user = await User2.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`${user.role} Loged-in`)
            const refreshToken = await generateRefreshToken(user._id, user.role, user.email)
            const updateUser = await User2.findByIdAndUpdate(user._id, {
                refreshToken: refreshToken,
            }, { new: true })
            // for 10 days
            res.cookie("refreshToken", refreshToken, { maxAge: 240 * 60 * 60 * 1000 })

            //            req.session.authorized = true

            const token = await jwt.sign(
                { user_id: user._id, role: user.role, email: user.email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "10d",
                }
            );
            user.token = token;
        } else {
            throw new Error("Invalid Email Or Password")
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};


// admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("Enter email and password");
        }

        let user = await Admin2.findOne({ email });
        if (user.role !== 'admin') { throw new Error("Not Authorised") }

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`${user.role} Loged-in`)
            const refreshToken = await generateRefreshToken(user._id, user.role, user.email)
            const updateUser = await User2.findByIdAndUpdate(user._id, {
                refreshToken: refreshToken,
            }, { new: true })
            // for 10 days
            res.cookie("refreshToken", refreshToken, { maxAge: 240 * 60 * 60 * 1000 })

            //            req.session.authorized = true

            const token = await jwt.sign(
                { user_id: user._id, role: user.role, email: user.email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "10d",
                }
            );
            user.token = token;
        } else {
            throw new Error("Invalid Email Or Password")
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};

const handleRefreshToken = async (req, res) => {
    try {
        const cookie = req.cookies;
        console.log(cookie)
        if (!cookie.refreshToken) {
            throw new Error("No Refresh Token in Cookies")
        }
        const refreshToken = cookie.refreshToken


        const user = await User2.findOne({ refreshToken })
        if (!user) {
            throw new Error("No Refresh token present in db or not matched")
        }
        jwt.verify(refreshToken, process.env.TOKEN_KEY, (err, decoded) => {
            if (err || user.id != decoded.id) {
                throw new Error("There is somthing wrong with refresh token")
            }
            const accessToken = generateRefreshToken(user._id)
            res.json({ accessToken })
            // console.log(decoded)
        })
        res.json({ user })
    } catch (err) {
        console.log(err)
    }
}

// Logout

const logout = async (req, res) => {
    const cookie = req.cookies
    if (!cookie.refreshToken) {
        throw new Error("NO Refresh Token in Cookies")
    }
    const refreshToken = cookie.refreshToken
    const user = await User2.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken")
        return res.status(200)
    } else {
        await User2.findOneAndUpdate({ refreshToken }, {
            refreshToken: ""
        })
        res.clearCookie("refreshToken")
    }

    return res.status(200).json({ message: "Logout successful" });
}


const updatePassword = async (req, res) => {
    try {
        const { _id } = req.user
        const password = req.body
        mongoose.Types.ObjectId.isValid(_id)
        const user1 = await User2.findById(_id)
        if (password) {
            const encryptedPassword = await bcrypt.hash(req.body.password, 10);

            const updatedPassword = await User2.findByIdAndUpdate(_id, { $set: { password: encryptedPassword } })
            res.json(encryptedPassword)

        } else {
            res.json(user1)
        }

    } catch (error) {
        throw new Error(error)
    }
}

const forgotPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User2.findOne({ email });

        if (!user) {
            throw new Error("User not found.");
        }

        const token = await createPasswordResetToken(user);
        user.role = "user";
        await user.save();

        const resetURL = `Hi! Please follow this link to reset your Password. This link is valid till 10 minutes from now. <a href="http://localhost:3000/api/reset-password/${token}">Click</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "There was an error while processing your request." });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
        const user = await User2.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error("Token expired or invalid. Please try again.")
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "There was an error while processing your request." })
    }
};


const createPasswordResetToken = async function (user) {
    const resetToken = crypto.randomBytes(32).toString("hex")
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // 10 minutes
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}





module.exports = { login, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin };
