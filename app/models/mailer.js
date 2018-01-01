const nodemailer = require('nodemailer');
module.exports = {
    send_mail:function(data) {
           var html="<h1>Below are the full details.</h1><br>";
            html="<b>Name : "+data.name+" <b><br>";
            html=html+"<b>Email : "+data.email+" <b><br>";
             html=html+"<b>Cpmment : "+data.comment+" <b><br>";
            let mailOptions = {
        from: '"TssAbnoy" <indra19933@gmail.com>', // sender address
        to: 'kumarindradevd9211@gmail.com', // list of receivers
        subject: 'Enquiry from TssAbnoy - Contact', // Subject line
        html: html// html body
    };
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "indra19933@gmail.com", // generated ethereal user
            pass: "7352507926"  // generated ethereal password
        }
    });

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
       // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });


    },
};