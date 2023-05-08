const jwt = require('jsonwebtoken');

const middlewareToken = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if(err){
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                console.log(user);    
                next();
            });
        }
        else{
            return res.status(401).json("You are not authenticated!");
        }
    },

    verifyTokenAdmin: (req,res,next) => {
        middlewareToken.verifyToken(req,res,() => {
            if(req.user.admin || req.user.id === req.params.id){
                next();
            }
            else{
                return res.status(403).json("You are not allowed to delete orther!");
            }
        })
    }
}

module.exports = middlewareToken;