const findAll = async (req, res, next) => {
    try {
        // Extract query parameters for sorting, pagination, and filtering
        const sequence = parseInt(req.query.sort);
        const page = parseInt(req.query.page);
        const offset = parseInt(req.query.offset);
        const level = req.query.level;

        let pipeline = [];

        // MongoDB aggregation pipeline for sorting and paginating assignments
        pipeline.push(
            {
                $sort: { 'maxMark': sequence ? sequence : 1 }
            }
        )

        if (page && offset) {
            pipeline.push(
                {
                    $skip: ((page - 1) * offset)
                },
                {
                    $limit: offset
                }
            )
        }

        if (level) {
            pipeline.push({
                $match: { level }
            })
        }

        // Aggregate assignments and retrieve count based on filtering
        const count = await Assignment.aggregate([
            { $match: { level } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        // Respond with the paginated assignments and count
        const result = await Assignment.aggregate(pipeline);
        res.json({ result, count });
    } catch (error) {
        next(error);
    }
};
module.exports = findAll;