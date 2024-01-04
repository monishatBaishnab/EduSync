const router = require('express').Router();
const User = require('../../models/user');

router.get('/users', async (req, res, next) => {
    try {
        const result = await User.find();
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.post('/users', async (req, res, next) => {
    try {
        const userData = new User(req.body);
        const result = await userData.save();
        res.json(result);
    } catch (error) {
        next(error);
    }
})

module.exports = router;