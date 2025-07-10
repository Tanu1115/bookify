const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token) return res.redirect('auth/login')
        try{
    const decoded = jwt.verify(token,SECRET);
    req.user = decoded;
    next();
    }catch (err){
        res.redirect('auth/login')
    }
}
module.exports = authMiddleware;