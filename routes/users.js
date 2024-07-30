const express = require('express');
const router = express.Router();
const db = require("../db");
const sendMail = require("../mail")

router.get('/new', (request, response) => {
  response.render("newUser",{title:'Cadastro de usuario', user: {}} );
})


router.get('/edit/:userId', (req, res, next) => {
  const id = req.params.userId;
  db.findUser(id)
    .then(user =>{
      res.render("newUser", 
      {title:'Edição de Usuario',
      user: user});
    })
    .catch(error => {
      console.log(error)
      res.render('error', {menssage: 'Não foi possivel listar os dados do usuario',  error})
     });
})

router.get('/delete/:userId', (req, res) => {
  const id = req.params.userId;
  db.deleteUser(id)
    .then(result => res.redirect('/users'))
    .catch(error => {
      console.log(error)
      res.render('error', {menssage: 'Não foi possivel excluir o usuario',  error})
     });
})

router.post('/new', async (req, res, next) => {
  const id = req.body.id;

  if(!req.body.name) 
    return res.redirect('/users/new?error = O campo nome é obrigatório');
  
  if(!id && !req.body.password) 
    return res.redirect('/users/new?error = O campo senha é obrigatório');
  
  if(req.body.cpf && !/[0-9\.\-]+/.test(req.body.cpf))
    return res.redirect("/users/new?error = cpf é apenas numeros")

  
  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  const cpf = req.body.cpf;
  const uf = req.body.uf;
  const cidade = req.body.cidade;

  const user = {name, email, cpf, address, uf, cidade};

  if(req.body.password)
    user.password = req.body.password;

  try{
    await id 
      ? db.updateUser(id, user)
      : db.insertUser(user);

      await sendMail(user.email, "Usuario criado com sucesso", `
        Olá ${user.name} !, 
        Seu usuario foi criado com sucesso!
        Use sua senha para se autenticar em ('site da aplicação')
      
        att.
        adim !
        `);
        
        res.redirect('/');
      }
      catch(error) {
        console.error(error);
        res.render("error", {message: "Não foi posivel salvar o usuario", error})
      };
})

/* GET home page. */
//usando promisses
router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);
  try{
      const qty = await db.totalUsers();
      const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
      const users = await db.findUsers(page);
      res.render('users', {title: "Usuarios", users, qty, pagesQty, page})
  }
  catch(error) {
      console.log(error)
      res.render("error", {message: 'Não foi possivel listar os usuarios',  error})
  }
});
module.exports = router;
