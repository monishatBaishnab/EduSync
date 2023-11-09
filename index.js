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
    origin: ['https://edusync-7a3f5.firebaseapp.com', 'https://edusync-7a3f5.web.app'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const verifyAuth = (req, res, next) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ error: 'Unauthorized access.' });
    }

    // Verify the token using the SECRET_KEY
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // If there's an error during token verification, send an unauthorized response
            res.status(401).send({ error: 'Unauthorized access.' });
        } else {
            // If the token is valid, set the user information in the request object and proceed to the next middleware
            req.user = decoded;
            next();
        }
    });
};

// MongoDB URI for connecting to the database
// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.viujuo0.mongodb.net/?retryWrites=true&w=majority`;

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
        const submitedAssignmentCollection = client.db('EduSync').collection('submitedAssignments');

        app.get('/', (req, res) => {
            res.send('Server Running...');
        })

        //Define API routes for genarate token
        app.post('/api/v1/token', (req, res) => {
            try {
                const user = req.body;
                const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
                res
                    .cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 60 * 60 * 1000
                    })
                    .send({ message: 'Cookie Stored.' });
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })

        app.post('/api/v1/logout/', (req, res) => {
            res.clearCookie('token', {
                maxAge: 0,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            })
            .send({ message: 'Cookie Cleared.' })
        })

        //Define API for get all assignments
        // this api use many cases
        // case 1: http://localhost:5000/api/v1/assignments
        // case 2: http://localhost:5000/api/v1/assignments?level=medium
        // case 3: http://localhost:5000/api/v1/assignments?difficulty=medium&sort=marks&sortOrder=desc
        // case 4: http://localhost:5000/api/v1/assignments?page=2&offset=5

        app.get('/api/v1/assignments', async (req, res) => {
            try {
                // Initialize objects for filtering and sorting
                const filterObj = {};
                const sortObj = {};

                // Retrieve query parameters from the request
                const level = req.query.level;
                const sort = req.query.sort;
                const sortOrder = req.query.sortOrder;
                const offset = parseInt(req.query.offset);
                const page = parseInt(req.query.page);
                const email = req.query.email;

                // If sorting parameters are provided, add them to the sortObj
                if (sort && sortOrder) {
                    sortObj[sort] = sortOrder;
                }

                // If a level parameter is provided, add it to the levelObj
                if (email) {
                    filterObj.user = { email };
                }
                if (level) {
                    filterObj.level = level;
                }

                const count = await assignmentCollection.estimatedDocumentCount();

                if (offset && page) {
                    // Query the assignmentCollection with the filter and sorting options
                    const result = await assignmentCollection.find(filterObj).sort(sortObj).limit(offset).skip((page - 1) * offset).toArray();
                    // Send the results as a response
                    res.send({ count, assignments: result });
                }
                else {
                    // Query the assignmentCollection with the filter and sorting options
                    const result = await assignmentCollection.find(filterObj).sort(sortObj).toArray();
                    // Send the results as a response
                    res.send({ count, assignments: result });
                }

            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })

        //Define API for get a specific assingment
        // case 1: http://localhost:5000/api/v1/assignments/65466adbab69dc9d9cc25c2f?email=baishnabmonishat@gmail.com
        app.get('/api/v1/assignments/:id', verifyAuth, async (req, res) => {
            try {
                const user = req.user;
                const email = req.query.email;
                const assignmentId = req.params.id;

                if (user.email === email) {
                    const result = await assignmentCollection.findOne({ _id: new ObjectId(assignmentId) });
                    res.send(result);
                }
                else {
                    res.status(500).send({ error: "An error occurred" });
                }
            } catch (error) {
                res.status(500).send({ error: "An error occurred" });
            }
        });

        //Define API for post a new assignment
        // case 1: http://localhost:5000/api/v1/assignments
        //assignment: {
        //     "title": "Updated Assignment!",
        //     "description": "Implement a binary search algorithm in C++.",
        //     "marks": 12,
        //     "thumbnailImageURL": "https://example.com/assignment7_thumbnail.jpg",
        //     "difficulty": "medium",
        //     "dueDate": "2024-03-01",
        //     "user": {
        //         "email": "baishnabmonishat@gmail.com"
        //     }
        // }
        app.post('/api/v1/assignments', verifyAuth, async (req, res) => {
            try {
                const email = req.query.email;
                const user = req.user;
                const assignment = req.body;
                if (user.email === email) {
                    const result = await assignmentCollection.insertOne(assignment);
                    res.send(result);
                } else {
                    res.status(500).send({ error: "An error occurred." });
                }
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })


        //Define API for delete a specific assignments
        // case 1: http://localhost:5000/api/v1/assignments/65467c24b85959ce7950c5dc?email=baishnabmonishat@gmail.com
        app.delete('/api/v1/assignments/:id', verifyAuth, async (req, res) => {
            try {
                const assignmentId = req.params.id;
                const email = req.query.email;
                const user = req.user;
                const assignmentEmail = req.query.assignmentEmail;

                if (user.email === email) {
                    if (user.email == assignmentEmail) {
                        const result = await assignmentCollection.deleteOne({ _id: new ObjectId(assignmentId) });
                        res.send(result);
                    } else {
                        res.status(500).send({ error: "User mismatch error." });
                    }
                } else {
                    res.status(500).send({ error: "An error occurred" });
                }
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        });

        //Define API for update a specific assignments
        // case 1: http://localhost:5000/api/v1/assignments/65466adbab69dc9d9cc25c34?email=baishnabmonishat@gmail.com
        app.put('/api/v1/assignments/:id', verifyAuth, async (req, res) => {
            try {
                const assignmentId = req.params.id;
                const email = req.query.email;
                const user = req.user;
                const assignmentEmail = req.query.assignmentEmail;
                const assignment = req.body;

                const updatedAssignment = {
                    $set: {
                        ...assignment
                    }
                }
                const filter = { _id: new ObjectId(assignmentId) };
                const options = { upsert: true }

                if (user.email === email) {
                    if (user.email === assignmentEmail) {
                        const result = await assignmentCollection.updateOne(filter, updatedAssignment, options);
                        res.send(result);
                    } else {
                        res.status(500).send({ error: "User mismatch error." });
                    }
                } else {
                    res.status(500).send({ error: "An error occurred" });
                }

            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        });


        app.get('/api/v1/submited/assignments', verifyAuth, async (req, res) => {
            try {
                const filterObj = {};

                const status = req.query.status;
                const submiterEmail = req.query.submiterEmail;
                const email = req.query.email;
                const user = req.user;

                if (status) {
                    filterObj.status = status;
                }
                if (submiterEmail) {
                    filterObj.submitedUser = submiterEmail;
                }

                if (user.email === email) {
                    const result = await submitedAssignmentCollection.find(filterObj).toArray();
                    res.send(result);
                } else {
                    res.status(500).send({ error: "An error occurred." });
                }
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })

        app.get('/api/v1/submited/assignments/:id', verifyAuth, async (req, res) => {
            try {
                const submitedId = req.params.id;
                const email = req.query.email;
                const user = req.user;
                if (user.email === email) {
                    const result = await submitedAssignmentCollection.findOne({ _id: new ObjectId(submitedId) });
                    res.send(result);
                } else {
                    res.status(500).send({ error: "An error occurred." });
                }
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })

        app.post('/api/v1/submited/assignments', verifyAuth, async (req, res) => {
            try {
                const email = req.query.email;
                const user = req.user;
                const assignment = req.body;
                if (user.email === email) {
                    const result = await submitedAssignmentCollection.insertOne(assignment);
                    res.send(result);
                } else {
                    res.status(500).send({ error: "An error occurred." });
                }
            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })

        app.patch('/api/v1/submited/assignments/:id', verifyAuth, async (req, res) => {
            try {
                const assignmentId = req.params.id;
                const email = req.query.email;
                const user = req.user;
                const body = req.body;

                const updatedAssignment = {
                    $set: {
                        ...body
                    }
                }

                const filter = { _id: new ObjectId(assignmentId) };
                if (user.email === email) {
                    const result = await submitedAssignmentCollection.updateOne(filter, updatedAssignment);
                    res.send(result);
                } else {
                    res.status(500).send({ error: "An error occurred" });
                }

            } catch (error) {
                console.log(error.message);
                res.status(500).send({ error: "An error occurred" });
            }
        })


        // Check the connection to MongoDB by sending a ping request
        await client.db('admin').command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.log(error);
    }
}

// Execute the MongoDB interaction function
mongodbRun();

// Start the Express server and listen on the defined port
app.listen(port, () => console.log("Server Running..."));
