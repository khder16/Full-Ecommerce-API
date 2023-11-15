const express = require('express')
const router = express.Router()
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controllers/categoryController')
const { verifyToken, authRole } = require('../middlewares/auth')


router.route('/create').post(createCategory)
router.route('/update/:id').patch(updateCategory)
router.route('/delete/:id').delete(deleteCategory)
router.route('/getCategory/:id').get(getCategory)
router.route('/getallCategory').get(getAllCategory)


module.exports = router