const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
//usando promisses


router.get('/', (request, response) => {
  response.render("index",{title:'Aplicação Com BootStrap'} );
})

module.exports = router;
