const Assignment = require('../../../models/assignment');

const deleteOne = async(req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Assignment.deleteOne({_id: id});
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = deleteOne;