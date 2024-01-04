module.exports = (err, req, res, next) => {
    if (err.message) {
        res.status(500).json(`Bad Request: ${err.message}`);
        console.log(err.message);
    } else {
        res.status(500).json(`Internal Server Error`);
    };
}