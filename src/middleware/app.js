const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const { LOCAL_CLIENT, PROD_CLIENT } = require('../config/config');

const applyMiddlewares = (app) => {
    app.use(cookieParser());
    app.use(cors({
        credentials: true,
        origin: [LOCAL_CLIENT, PROD_CLIENT]
    }));
    app.use(express.json());
}

module.exports = applyMiddlewares;