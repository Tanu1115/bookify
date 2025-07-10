const jwt = require('jsonwebtoken')
const User = require('../models/user');

const setUser = async (req,res,next) =>{
    res.locals.user = null;

    const token = req.cookies.token;

    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const loggedInUser = await
            User.findById(decoded.userId);
            res.locals.user = loggedInUser;
            console.log("logged in user set in res.locals:", res.locals.user.name);
        } catch(err){
            console.log("JWT error:",err.message);
        }
    }
    next();
    console.log("Logged in user set in res.locals.user:",res.locals.user);
}
module.exports = setUser;