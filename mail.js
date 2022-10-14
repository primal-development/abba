const nodemailer = require("nodemailer");
require('dotenv').config();
const fs = require('fs');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "silasdemez@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

let html = null;

async function sendRegistrationMail(recipient, email_file) {
    let mailOptions = {
        from: "silasdemez@gmail.com",
        to: recipient,
        subject: "Register your training diary account",
        html: email_file,
      };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
          return false; 
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
    });
}


async function main(){
    fs.readFile('src/mail.html', function(err, data){
        sendRegistrationMail('fabiansenoner2002@gmail.com', data);
    });
    
}

main();