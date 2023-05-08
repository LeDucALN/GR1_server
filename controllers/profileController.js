const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const profileController = {
    show: async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            const {password, ...others} = user._doc;
            res.status(200).json({others});
        }catch(err){
            res.status(500).json(err);
        }
    },
    
    delete: async (req, res) => {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("User has been deleted...");
        }catch(err){
            return res.status(500).json(err);
        }
    }
}

module.exports = profileController;

