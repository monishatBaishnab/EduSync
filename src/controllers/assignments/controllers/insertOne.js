const Assignment = require('../../../models/assignment');
const insertOne = async (req, res, next) => {
    try {
        // Create a new assignment using request body and save to database
        const assignmentData = new Assignment(req.body);
        const result = await assignmentData.save();

        // Respond with the saved assignment data
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = insertOne;