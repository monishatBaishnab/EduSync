const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const { LOCAL_CLIENT, PROD_CLIENT } = require('../config/config');

const applyMiddlewares = (app) => {
    app.use(cookieParser());
    app.use(cors({
        origin: [LOCAL_CLIENT, PROD_CLIENT],
        credentials: true
    }));
    app.use(express.json());
}

module.exports = applyMiddlewares;