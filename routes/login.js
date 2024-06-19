const express = require('express');
const router = express.Router();
const db = require("../db");

/* GET home page. */
//usando promisses


router.get('/', (request, response) => {
  response.render("login",{title:'Login'} );
})

module.exports = router;
