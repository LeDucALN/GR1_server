const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authControllers = {
    register: async (req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            const user = await newUser.save();
            const {password, ...info} = user._doc;
            res.status(200).json(info);
        }catch(err){
            res.status(500).json(err);
        }
    },


    //init accessToken
    accessToken: (user) => {
        return jwt.sign({id: user._id, admin: user.admin}, process.env.JWT_ACCESS_KEY, {expiresIn: '60s'});
    },

    //init refreshToken
    refreshToken: (user) => {
        return jwt.sign({id: user._id, admin: user.admin}, process.env.JWT_REFRESH_KEY, {expiresIn: '1d'});
    },

    login: async (req,res) => {
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(400).json('Wrong username!');
            }
            else {
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if(!validPassword){
                    return res.status(400).json('Wrong password!');
                }
                if(user && validPassword){
                    const accessToken = authControllers.accessToken(user);
                    const refreshToken = authControllers.refreshToken(user);
                    res.cookie('refreshToken', refreshToken, {httpOnly: true, path: '/', secure: false, samSite: "strict"})
                    const {password, ...info} = user._doc;
                    res.status(200).json({...info, accessToken});
                }
            }
        }catch(err){
            return res.status(500).json(err);
        }
    },

    refresh: async(req,res) => {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        if(!refreshToken){
            return res.status(401).json('You are not authenticated!');
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err){
                return res.status(403).json('Token is not valid!');
            }
            const newAccessToken = authControllers.accessToken(user);
            const newRefreshToken = authControllers.refreshToken(user);
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, path: '/', secure: false, samSite: "strict"});
            return res.status(200).json({accessToken: newAccessToken});
        });
    },


    logout: async(req,res) => {
        res.clearCookie('refreshToken');
        return res.status(200).json('Logged out!');
    }   
}
module.exports = authControllers;   