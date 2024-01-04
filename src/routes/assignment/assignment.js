const router = require('express').Router();
const { findAll } = require('../../controllers/assignments');
const Assignment = require('../../models/assignment');

router.get('/assignments', findAll);

router.post('/assignments', async (req, res, next) => {
    try {
        // Create a new assignment using request body and save to database
        const assignmentData = new Assignment(req.body);
        const result = await assignmentData.save();

        // Respond with the saved assignment data
        res.json(result);
    } catch (error) {
        next(error);
    }
})

module.exports = router;