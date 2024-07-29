const nodemailer = require("nodemailer")

module.exports = async (to, subject, text) => {
    
    nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const message = {
        from: process.env.SMTP_USERNAME,
        to ,
        subject,
        text
      };
}