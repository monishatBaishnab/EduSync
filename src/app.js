const express = require('express');

const app = express();
const applyMiddlewares = require('./middleware');
const pathErrorHanlder = require('./middleware/pathErrorHandler')
const globalErrorHandler = require('./middleware/globalErrorHandler')
const assignmentRoute = require('./routes/assignment/assignment');
const solutionRoute = require('./routes/solution/solution');
const usertRoute = require('./routes/user/user');
const authRoute = require('./routes/auth/auth');

// Apply all necessary middlwares to 'app' 
applyMiddlewares(app);

// Set up routes for assignments, solutions, users, and authentication
app.use(assignmentRoute);
app.use(solutionRoute);
app.use(usertRoute);
app.use(authRoute);

//Define a helth chek endpoint to check server status.
app.get('/health', (req, res) => {
    res.json('The server is currently operational.');
})

// Set up path-specific error handling middleware
app.use(pathErrorHanlder);

// Set up global error handling middleware
app.use(globalErrorHandler);

module.exports = app;