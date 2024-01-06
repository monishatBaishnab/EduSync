const Assignment = require('../../../models/assignment');

const findOne = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Assignment.findById({ _id: id }).populate('author');
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = findOne;