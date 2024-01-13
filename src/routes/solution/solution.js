const router = require('express').Router();
const validateIdentity = require('../../middleware/validateIdentity');
const Solution = require('../../models/solution');

router.get('/solutions', validateIdentity, async (req, res, next) => {
    try {
        const assignmentId = req.query.id;
        const offset = req.query.offset;
        const filterObj = {};
        if(assignmentId){
            filterObj.assignment = assignmentId;
        }

        const result = await Solution.find(filterObj).limit(offset).populate('solver');
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.get('/solutions/:id', validateIdentity, async (req, res, next) => {
    try {
        const id = req.params.id;
        const filterObj = {}
        if(id){
            filterObj._id = id;
        }

        const result = await Solution.find(filterObj).populate('solver');
        res.json(result);
    } catch (error) {
        next(error);
    }
})

router.post('/solutions', validateIdentity, async (req, res, next) => {
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