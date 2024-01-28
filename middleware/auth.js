const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.authenticate = async(req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(token);
        const userDetails = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        // console.log(userDetails);
        const user = await User.findByPk(userDetails.userID)
        req.user = user;
        // console.log(req.user);
        next();
    }
    catch(err) {
        console.log(err);
    }
}