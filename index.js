// Import required modules and libraries
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Initialize the Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// MongoDB URI for connecting to the database
const uri = "mongodb://localhost:27017";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.viujuo0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoDB client instance
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

// Function to interact with MongoDB
const mongodbRun = async () => {
    try {
        // Connect to the MongoDB database
        await client.connect();

        // Access the 'services' collection within the 'emaJohnDB' database
        const assignmentCollection = client.db('EduSync').collection('assignments');

        //Define API routes for genarate token
        app.post('/api/v1/token', (req, res) => {
            try {
                const user = req.body;
                const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'none' }).send({ message: 'Success' });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ error: "An error occurred" });
            }
        })
        

        // Check the connection to MongoDB by sending a ping request
        await client.db('admin').command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.log(error);
    }
}


// Start the Express server and listen on the defined port
app.listen(port, () => console.log("Server Running..."));
