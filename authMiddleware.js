const auth = require("./auth");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./db");

module.exports = (passport) => {
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