const express = require('express');
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

/* GET home page. */
//usando promisses

router.get('/', (request, response) => {
  response.render("login",{title:'Login', message:""} );
})

router.get('/forgot', (request, response) => {
  response.render("forgot",{title:'Forgot password?', message:""} );
})

router.post('/login', async (req, res) => { 
  const name = req.body.name;
  const user = await auth.findUserByName(name); //função find da auth.js
  
  if(!user) return res.render("login", {title:'Login', message:'Usuário e/ou senha INVÁLIDOS'});

  const password = req.body.password;
  if(!bcrypt.compareSync(password, user.password)) return res.render("login", {title:'Login', message:'Usuário e/ou senha INVÁLIDOS'});

  res.redirect("/index");

})

router.post('/forgot', async(req, res) =>{
  const email = req.body.email;
  if(!email) 
    return res.render("forgot", {title:"Forgot password?", message:"Email é OBRIGATÓRIO!"})
  
  const user = await auth.findUserByEmail(email); // auth.js
  if(!user) 
    return res.render("forgot", {title:"Forgot password?", message:"Email não cadastrado"})
  
  const newPassword = auth.generatePassword();
  user.password = newPassword;

  await db.updateUser(user._id.toString(), user);
  
  res.render("forgot", {title:"Forgot password?", message: newPassword}); 
})

module.exports = router;
