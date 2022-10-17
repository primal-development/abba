const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs");
const handlebars = require('handlebars');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "silasdemez@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

let email_file;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function sendPassResetMail(recipient) {
  let auth_code = getRandomInt(999999);

  let template = handlebars.compile(email_file);
  let data = {
      auth_code : auth_code,
      title : "Password reset confirmation request",
      text : "To reset your password you have to enter the following code"
  };
  let htmlToSend = template(data);
  
  let mailOptions = {
    from: "silasdemez@gmail.com",
    to: recipient,
    subject: "Reset your training_diary password",
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      sendRegistrationMail(recipient);
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
  return auth_code;
}

async function sendRegistrationMail(recipient) {
  // console.log("Email file: ");
  // console.log(email_file.toString());
  let auth_code = getRandomInt(999999);

  let template = handlebars.compile(email_file);
  let data = {
      auth_code : auth_code,
      title : 'Your email needs to be verified',
      text : "To register on the training diary you have to enter this code to activate your account"
  };
  let htmlToSend = template(data);
  
  let mailOptions = {
    from: "silasdemez@gmail.com",
    to: recipient,
    subject: "Register your training diary account",
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      sendRegistrationMail(recipient);
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
  return auth_code;
}

async function start() {
  fs.readFile("src/mail.html", (err, data) => {
    if (err) console.log("error", err);
    email_file = data.toString();
  });
}

module.exports = {
  sendRegistrationMail,
  sendPassResetMail,
  start,
};
