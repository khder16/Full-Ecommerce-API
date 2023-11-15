const express = require('express')
const router = express.Router()
const { verifyToken, authRole } = require('../middlewares/auth')
const { createBrand, updateBrand, getBrand, deleteBrand , getAllBrand} = require('../controllers/brandController')


router.route('/create').post(createBrand)
router.route('/update').patch(updateBrand)
router.route('/getAllBrands').get(getAllBrand)
router.route('/getBrand/:id').get(getBrand)
router.route('/deleteBrand').delete(deleteBrand)

module.exports = router