const express = require('express')
const router = express.Router()
const { verifyToken, authRole } = require('../middlewares/auth')
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController')


router.route('/').post(verifyToken, createCoupon)
router.route('/getallcoupon').get(verifyToken, getAllCoupon)
router.route('/updatecoupon/:id').patch(verifyToken, updateCoupon)
router.route('/deletecoupon/:id').delete(verifyToken, deleteCoupon)

module.exports = router