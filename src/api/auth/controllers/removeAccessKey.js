require('dotenv').config();

const removeAccessKey = async (req, res, next) => {
    try {
        try {
            res.clearCookie('access-key', {
                maxAge: 0,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            }).json('Access key removed.')
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = removeAccessKey;