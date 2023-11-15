const nodemailer = require('nodemailer')

const sendEmail = async (data, req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.UG,
            pass: process.env.PG,
        },
    });


    const info = await transporter.sendMail({
        from: process.env.UG, // sender address
        to:  'khdrhabeb16@hotmail.com', // list of receivers
        subject: "Work", // Subject line
        text: "How are You", // plain text body
        html: data.html, // html body
    });

}
module.exports = sendEmail 