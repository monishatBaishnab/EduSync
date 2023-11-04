// Import required modules and libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
    credentials: true
}));
app.use(express.json());


// Start the Express server and listen on the defined port
app.listen(port, () => console.log("Server Running..."));
