//AUTENTICAÇÃO
const {connect} = require("./db")

async function  findUser(name){
        const connection = await connect();
        return connection
                    .collection("users")
                    .findOne({name})//.find{} passa o filtro\; 
}

module.exports = {
    findUser
}