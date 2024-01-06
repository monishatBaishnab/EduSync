const router = require('express').Router();
const Solution = require('../../models/solution');

router.get('/solutions', async (req, res, next) => {
    try {
        const assignmentId = req.query.id;
        const result = await Solution.find({ assignment: assignmentId });
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.post('/solutions', async (req, res, next) => {
    try {
        // Create a new solution using request body and save to database
        const solutionData = new Solution(req.body);
        const result = await solutionData.save();

        // Respond with the saved solution data
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;