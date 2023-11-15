// not found 
const { StatusCode } = require('http-status-codes')

const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`)
    res.status(404)
    // error handler تمرر الخطا الى  next 
    next(error)
}

// Error Handler
const errorHandler = (err, req, res, next) => {
    console.error(err);


    if (err instanceof CustomErrorType) {
        return res.status(err.statusCode).send({ error: err.message });
    }

    res.status(500).send({ error: 'Internal Server Error' });
};
module.exports = { errorHandler, notFound }
