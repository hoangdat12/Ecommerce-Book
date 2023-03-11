const nodemailer = require('nodemailer')


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'datttp113@gmail.com',
        pass: process.env.SECRET_KEY_EMAIL
    }
})


const sendEmail = (email, otp) => {  
    let config = {
        from: 'datttp113@gmail.com',
        to: email,
        subject: 'Active account!',
        text: otp
    }

    mailTransporter.sendMail(config, function(error, info){
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = sendEmail