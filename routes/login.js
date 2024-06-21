const express = require('express');
const router = express.Router();
const db = require("../db");
const { findUser } = require('../auth');
const bcrypt = require("bcryptjs");

/* GET home page. */
//usando promisses


router.get('/', (request, response) => {
  response.render("login",{title:'Login', message:""} );
})

router.post('/login', async (req, res) => { 
  const name = req.body.name;
  const user = await findUser(name); //função find da auth.js
  
  if(!user) return res.render("login", {title:'Login', message:'Usuário e/ou senha INVÁLIDOS'});

  const password = req.body.password;
  if(!bcrypt.compareSync(password, user.password)) return res.render("login", {title:'Login', message:'Usuário e/ou senha INVÁLIDOS'});

  res.redirect("/index");

})

module.exports = router;
