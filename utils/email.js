const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1- Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2- Define email options
  const mailOptions = {
    from: "EduTech LMS <[edutechcttm38@gmail.com]>",    
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  //3- sending the mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
