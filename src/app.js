const express = require('express');

const app = express();
const applyMiddlewares = require('./middleware');
const pathErrorHanlder = require('./middleware/pathErrorHandler')
const globalErrorHandler = require('./middleware/globalErrorHandler')

// Apply all necessary middlwares to 'app' 
applyMiddlewares(app);

//Define a helth chek endpoint to check server status.
app.get('/helth', (req, res) => {
    res.json('The server is currently operational.');
})

// Set up path-specific error handling middleware
app.use(pathErrorHanlder);

// Set up global error handling middleware
app.use(globalErrorHandler);

module.exports = app;