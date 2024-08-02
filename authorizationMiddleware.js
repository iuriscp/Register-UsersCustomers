const USER = 1;
const ADMIN = 2;

module.exports = (req, res, next) => {

    if(req.isAuthenticated()) {
        const user = req.user;
        if(user){
            const profile = parseInt(user.profile);

            const originalUrl = req.originalUrl;
            const method = req.method;

            if(originalUrl.indexOf("/users") != -1 && profile !== ADMIN){
                res.render("login", {title: "login", message:"Autentique-se para acessar essa página"});
            }

            return next();
        }
    }
    res.render("login", {title: "login", message:"Autentique-se para acessar essa página"});
}