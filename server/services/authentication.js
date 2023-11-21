const session = require("express-session");

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
    console.log(req.session.user);
    if (req.session.user) {
        return next();
    } else {
        res.redirect("/login");
    }
}


module.exports = {isAuthenticated};