exports.homeRoutes = (req,res) => {
    res.render('index')
};

// render view employee details page
exports.viewRoutes = (req,res) => {
    res.render('employeedetails')
};

// render login page
exports.loginRoutes = (req,res) => {
    res.render('login');
}
// render signup page
exports.signupRoutes = (req,res) => {
    res.render('signup');
}