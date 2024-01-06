const generateKey = require("../../../utils/generateKay");
require('dotenv').config();

const createAccessKey = async (req, res, next) => {
    try{
        const info = req.body;
        const accessKey = generateKey(info);
        try {
            res.cookie('access-key', accessKey, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            }).json('Access key stored.')
        } catch (error) {
            next(error);
        }
    }catch(error){
        next(error);
    }
}

module.exports = createAccessKey;