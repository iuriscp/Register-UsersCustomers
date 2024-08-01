const auth = require("./auth");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./db");

module.exports = (passport) => {

    //Transforma um objeto de usuario em string para salvar dentro da sessão
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    //recuperar informaçoes de usuario a partir da sessao
    passport.deserializeUser(async(id, done)=>{
        try{
            const user = await db.findUser(id);
            done(null, user);
        }catch(err){
            done(err, false);
        }
    })

    passport.use(new LocalStrategy({
        usernameField: "name",
        passwordField: "password"
    },
      async(username, password, done) => {
        try{
            const user = await auth.findUserByName(username);
            console.log(user)
            
            if(!user) return done(null, false);
            if(!bcrypt.compareSync(password, user.password))
                return done(null, false);
            else
                return done(null, user);

        }
        catch(err){
            return done(err, false);
        }
      }
    ))
}