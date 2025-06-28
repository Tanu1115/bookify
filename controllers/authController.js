 exports.getLogin = (req,res) =>{
    res.render('auth/login');
};
exports.postLogin = (req,res,next) =>{
    res.redirect("/")
}
