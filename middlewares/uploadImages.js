const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const { log } = require('winston')

const multerStorage = multer.diskStorage({
    //cb is a callback function
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname + ".jpeg")
    }
})

const multerFilter = (req, file, cb) => {
    try {
        const fileTypes = /jpeg|jpg|png|gif|svg/
        const exname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimetype = fileTypes.test(file.mimetype)
        if (mimetype && exname) {
            cb(null, true)
        } else {
            cb({
                message: "Unsupported file format"
            },
                false
            )
        }
    } catch (error) {
        console.log(error);
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }
})

const productImgResize = async (req, res, next) => {
    if (!req.files) {
        return next()
    }
    await Promise.all(
        req.files.map((file) => {
            sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/products/${file.filename}`)
        })
    )
    next()

}

const blogImgResize = async (req, res, next) => {
    if (!req.files) {
        return next()
    }
    await Promise.all(
        req.files.map((file) => {
            sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/blogs/${file.filename}`)
        })
    )
    next()
}

module.exports = { blogImgResize, productImgResize, uploadPhoto }