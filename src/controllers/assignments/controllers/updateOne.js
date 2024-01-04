const Assignment = require('../../../models/assignment');

const updateOne = async (req, res, next) => {
    try {
        const id = req.params.id;
        const assignmentData = req.body;
        const updatedAssignmentData = {
            $set: { ...assignmentData }
        }
        const result = await Assignment.updateOne({ _id: id }, updatedAssignmentData);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = updateOne;