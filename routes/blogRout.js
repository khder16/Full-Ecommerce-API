const express = require('express')
const router = express.Router()
const { verifyToken, authRole } = require('../middlewares/auth')
const { createBlog,
    updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages, } = require('../controllers/blogcontroller')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')




router.route('/create').post(createBlog)
router.route('/update').patch(updateBlog)
router.route('/getAllBlogs').get(getAllBlogs)
router.route('/getBlog').get(getBlog)
router.route('/upload/:id').put(verifyToken, uploadPhoto.array("images", 10), uploadImages)
router.route('/deleteBlog').delete(deleteBlog)
router.route('/likes').put(verifyToken, liketheBlog)
router.route('/dislikes').put(verifyToken, disliketheBlog)


module.exports = router