/*
encadiamento para excutar somente quando o connect terminar (callbacks, promisses,ASYNC AWAIT)
ASYNC --> funcao assincrona
AWAIT --> O codigo aguarda o final do processo para avançar e nao der erro
*/
    //carrega somente a classe mongoclient---> para inicializar uma conexao
const { MongoClient, ObjectId}  = require("mongodb");
const bcrypt = require("bcryptjs");
const PAGE_SIZE = 8;

async function connect(){
    // sempre verifica se ja existe uma conexao --> se nao vai para o try e connecta
    if (global.connection) return global.connection;
    //cria nova conexao de mongo, novo cliente de mongo;;string de conexao--->info necessaria prara conectar ao bd
    const client = new MongoClient(process.env.MONGODB_CONNECTION); //pré configura a conexao usa variavel de ambiente
    try{
        await client.connect();//conecta de fato
        global.connection = client.db(process.env.MONGODB_DATABASE);
        console.log("Connected");
    } catch (err){
        console.log(err);
        global.connection = null;
    }
    return global.connection;
}

async function totalCustomers(){
    const connection = await connect();
    return connection
                .collection("customers")
                .countDocuments()
}

async function findCustomers(page=1){
    const total_skip = (page - 1) * PAGE_SIZE
    const connection = await connect();
    return connection
                .collection("customers")
                .find({})//.find{} passa o filtro\
                .skip(total_skip)
                .limit(PAGE_SIZE)
                .toArray(); 
}

async function findCustomer(id){
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id)
    return connection
                .collection("customers")
                .findOne({_id: objectId})
}

async function insertCustomer(customer){
    const connection = await connect();
    return connection
                .collection("customers")//comando mongodb 
                .insertOne(customer);//comando mongo db
}

async function updateCustomer(id, customer){
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id);
    return connection
                .collection("customers")
                .updateOne({_id: objectId }, {$set: customer })
}

async function deleteCustomer(id){
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id)
    return connection
                .collection("customers")
                .deleteOne({_id: objectId});
}

//comandos para USERS no BD.

async function totalUsers(){
    const connection = await connect();
    return connection
                .collection("users")
                .countDocuments()
}

async function findUsers(page=1){
    const total_skip = (page - 1) * PAGE_SIZE
    const connection = await connect();
    return connection
                .collection("users")
                .find({})//.find{} passa o filtro\
                .skip(total_skip)
                .limit(PAGE_SIZE)
                .toArray(); 
}

async function findUser(id){
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id)
    return connection
                .collection("users")
                .findOne({_id: objectId})
}

async function insertUser(user){
    user.password = bcrypt.hashSync(user.password, 12); 

    const connection = await connect();
    return connection
                .collection("users")//comando mongodb 
                .insertOne(user);//comando mongo db
}

async function updateUser(id, user){
    if(user.password)
        user.password = bcrypt.hashSync(user.password, 12);
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id);
    return connection
                .collection("users")
                .updateOne({_id: objectId }, {$set: user })
}

async function deleteUser(id){
    const connection = await connect();
    const objectId = ObjectId.createFromHexString(id)
    return connection
                .collection("users")
                .deleteOne({_id: objectId});
}


module.exports = {
    PAGE_SIZE,
    findCustomers, 
    findCustomer, 
    insertCustomer, 
    updateCustomer, 
    deleteCustomer,
    totalCustomers,
    findUsers, 
    findUser, 
    insertUser, 
    updateUser, 
    deleteUser,
    totalUsers,
    connect,
}