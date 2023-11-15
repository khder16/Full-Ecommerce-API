const express = require('express')
const router = express.Router()
const { b_createCategory, b_updateCategory, b_deleteCategory, b_getCategory, b_getAllCategory } = require('../controllers/blogCategory')
const { verifyToken, authRole } = require('../middlewares/auth')


router.route('/create').post(b_createCategory)
router.route('/update/:id').patch(b_updateCategory)
router.route('/delete/:id').delete(b_deleteCategory)
router.route('/getCategory/:id').get(b_getCategory)
router.route('/getallCategory').get(b_getAllCategory)


module.exports = router