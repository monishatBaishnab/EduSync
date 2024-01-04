module.exports = (req, res, next) => {
    const error = new Error(`Sorry, the requested path '${req.originalUrl}' was not found.`);
    error.status = 404;
    next(error);
};