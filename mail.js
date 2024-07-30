const nodemailer = require("nodemailer");

module.exports = async (to, subject, text) => {
    
    const smtpTransport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      const message = {
        to,
        from: process.env.SMTP_USERNAME, 
        subject,
        text
      }

    try{
        await smtpTransport.sendMail(message);
       console.log("e-mail enviado com sucesso")
    }
    catch(err){
        console.error(err);
        throw err;
    } 
    finally{
        smtpTransport.close();
    }
}