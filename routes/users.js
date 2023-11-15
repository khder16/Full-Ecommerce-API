const express = require('express')

const router = express.Router()
const { registerUser, registerAdmin, updateOrderStatus, createOrder, getOrder, emptyCart, applyCoupon, getUserCart, svaeAddress, getAllAdmins, getAllUsers, updateUser, blockUser, unblockUser, getUser, getWishlist, userCart } = require('../controllers/userController')
const { verifyToken, authRole } = require('../middlewares/auth')



router.route('/register/user').post(registerUser)
router.route('/register/admin').post(registerAdmin)
router.route('/register/saveaddress').post(verifyToken, svaeAddress)
router.route('/cart').post(verifyToken, userCart)
router.route('/getusercard').get(verifyToken, getUserCart)
router.route('/getorder').get(verifyToken, getOrder)
router.route('/updateorder/:id').patch(verifyToken, updateOrderStatus)
router.route('/cart/createorder').post(verifyToken, createOrder)
router.route('/emptycart').delete(verifyToken, emptyCart)
router.route('/cart/applycoupon').post(verifyToken, applyCoupon)
router.route('/register/getadmins').get(verifyToken, authRole, getAllAdmins)
router.route('/register/getusers').get(verifyToken, getAllUsers)
router.route('/register/getWishlist').get(verifyToken, getWishlist)
router.route('/register/getuser').get(verifyToken, getUser)
router.route('/:id').patch(verifyToken, authRole, updateUser)
router.route("/block-user/:id", verifyToken, authRole, blockUser)
router.route("/unblock-user/:id", verifyToken, authRole, unblockUser)
module.exports = router