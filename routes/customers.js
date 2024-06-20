const express = require('express');
const router = express.Router();
const db = require("../db");


router.get('/new', (request, response) => {
  response.render("newCustomer",{title:'Cadastro de cliente', customer: {}} );
})


router.get('/edit/:customerId', (req, res, next) => {
  const id = req.params.customerId;
  db.findCustomer(id)
    .then(customer =>{
      res.render("newCustomer", 
      {title:'Edição de cadastro',
      customer: customer});
    })
    .catch(error => {
      console.log(error)
      res.render('error', {menssage: 'Não foi possivel listar os dados do cliente',  error})
     });
})

router.get('/delete/:customerId', (req, res) => {
  const id = req.params.customerId;
  db.deleteCustomer(id)
    .then(result => res.redirect('/customers'))
    .catch(error => {
      console.log(error)
      res.render('error', {menssage: 'Não foi possivel excluir o cliente',  error})
     });
})

router.post('/new', (req, res, next) => {
  if(!req.body.name) return res.redirect('/customers/new?error = O campo nome é obrigatório');
  if(req.body.cpf && !/[0-9\.\-]+/.test(req.body.cpf))
    return res.redirect("/customers/new?error = cpf é apenas numeros")
  const id = req.body.id;
  const name = req.body.name;
  const idade = req.body.idade;
  const address = req.body.address;
  const cpf = req.body.cpf;
  const uf = req.body.uf;
  const cidade = req.body.cidade;

  const customer = {name, idade, cpf, address, uf, cidade};
  const promise = id ? db.updateCustomer(id, customer)
                     : db.insertCustomer(customer);
  promise //promise numa variavel
    .then(result => 
      res.redirect('/customers')
    )
    

})

/* GET home page. */
//usando promisses
router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);
  try{
      const qty = await db.totalCustomers(); // await aguarda o total de customers do db
      const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
      const customers = await db.findCustomers(page);
      res.render('customers', {title: "Clientes", customers, qty, pagesQty, page})
  }
  catch(error) {
      console.log(error)
      res.render("error", {message: 'Não foi possivel listar os clientes',  error})
  }
});
module.exports = router;
