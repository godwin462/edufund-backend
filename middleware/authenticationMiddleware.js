const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            })
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRETE);
        const user = await userModel.findById(decoded.id);

        if (user === null) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found, please create an account'
            })
        }
        req.user = decoded;
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session expired, Please login again to continue'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}


exports.adminAuth = async(req, res, next)=> {
    if (req.user.isAdmin !== true) {
        return res.status(403).json({
            message: "You're not authorized perform this action."
        })
    } else{
        next()
    }
}
