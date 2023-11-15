const express = require('express')
const router = express.Router()
const { login, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin } = require('../controllers/login')
const { verifyToken } = require('../middlewares/auth')

router.route('/login').post(login)
router.route('/Admin-Login').post(loginAdmin)
router.route('/refresh').get(handleRefreshToken)
router.route('/logout').get(logout)
router.route('/password').patch(verifyToken, updatePassword)
router.route('/forgot-password-token').post(forgotPasswordToken)
router.route('/reset-password/:token').post(resetPassword)
module.exports = router
