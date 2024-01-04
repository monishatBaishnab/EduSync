const router = require('express').Router();
const Solution = require('../../models/solution');

router.get('/solutions', async (req, res, next) => {
    try {
        const result = await Solution.find();
        res.json(result);
    } catch (error) {
        next(error);
    }
})

module.exports = router;