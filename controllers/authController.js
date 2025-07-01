 const getLogin = async (req,res) =>{
    res.render('/auth/login');
};
const  postLogin = async (req,res) =>{
    res.redirect("/")
}
 const getSignup = async (req,res) =>{
    res.render('/auth/signup');
 };
 const postSignup = async (req,res) =>{
    res.render("/")
 }
 module.exports = {
   getLogin,
   postLogin,
   getSignup,
 postSignup
 }