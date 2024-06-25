//AUTENTICAÇÃO
const {connect} = require("./db")

async function  findUserByName(name){
        const connection = await connect();
        return connection
                    .collection("users")
                    .findOne({name})//.find{} passa o filtro\; 
};

async function  findUserByEmail(email){
    const connection = await connect();
    return connection
                .collection("users")
                .findOne({email})//.find{} passa o filtro\; 
};

function generatePassword(){
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let password = ""

    for(let i=0; i<10; i++){
        password += chars.charAt(Math.random()* chars.length)
    }
    return password;
};

module.exports = {
    findUserByName,
    findUserByEmail,
    generatePassword
}