const express = require('express');
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const sendMail = require("../mail");
const passport = require("passport");

/* GET home page. */
//usando promisses

router.get('/', (request, response) => {
  response.render("login",{title:'Login', message:""} );
})

router.get('/forgot', (request, response) => {
  response.render("forgot",{title:'Forgot password?', message:""} );
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/error"
    }
  ))

router.post('/forgot', async(req, res) =>{
  const email = req.body.email;
  if(!email) 
    return res.render("forgot", {title:"Forgot password?", message:"Email é OBRIGATÓRIO!"})
  
  const user = await auth.findUserByEmail(email); // auth.js
  if(!user) 
    return res.render("forgot", {title:"Forgot password?", message:"Email não cadastrado"})
  
  const newPassword = auth.generatePassword();
  user.password = newPassword;

 try{
    await db.updateUser(user._id.toString(), user);
    await sendMail(user.email, "Senha alterada com sucesso", `
      Olá ${user.name}, sua senha foi alterada com sucesso para: 
            ${newPassword}
      Use-a para se autenticar em ('site da aplicação')
    
      att.
      adim !
      `);

    res.render("login", {title:"Login", message: "verifique sua caixa de email"});
  } catch (err){
    res.render("forgot", {title:"Forgot password?", message: err.message})
  }
})

module.exports = router;
