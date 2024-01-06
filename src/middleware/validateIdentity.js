const jwt = require("jsonwebtoken");
require('dotenv').config();

const validateIdentity = async (req, res, next) => {
    try {
        const info = req?.cookies?.accessKey;
        
        if (!info) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Access denied. Please provide a valid access key.",
            })
        }
        jwt.verify(info, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).json({
                    error: "Unauthorized",
                    message: "Access denied. Please provide a valid access key.",
                })
            }
            req.info = decoded;
            next();
        })
    } catch (error) {
        next(error);
    }
}

module.exports = validateIdentity;