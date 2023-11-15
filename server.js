const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const connectDB = require('./config/db')
const session = require('express-session')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const usersRouter = require('./routes/authRout')
const users = require('./routes/users')
const product = require('./routes/productRout')
const login = require('./routes/authRout')
const brand = require('./routes/brandRout')
const coupon = require('./routes/couponRout')
const category = require('./routes/productcategory')
const blog = require('./routes/blogRout')
const blogCategory = require('./routes/blogcategory')
const slugify = require('slugify')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const expiryDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        expires: expiryDate
    }
}));

app.use('/api/user', users)
app.use('/api', login)
app.use('/api/product', product)
app.use('/api/blog', blog)
app.use('/api/category', category)
app.use('/api/blogcategory', blogCategory)
app.use('/api/brand', brand )
app.use('/api/coupon', coupon )


app.use(notFound)
app.use(errorHandler)


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        await connectDB(process.env.MONGO_URI)
    } catch (err) {
        console.log(err)
    }
}


start()

