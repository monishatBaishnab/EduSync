const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateKey = (info) => {
    return jwt.sign(info, process.env.SECRET_KEY, { expiresIn: '1d' });
}

module.exports = generateKey;