const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const app = express();


app.use(cookieParser());
app.use(cors());

app.get('/helth', (req, res) => {
    res.send('success');
})

module.exports = app;