// Imported Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();

// Using packages
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Required Paths
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');

const pagesRoutes = require('./routes/pagesRoutes');

// API Routing
app.use('/user', userRoutes);

// Pages Routing
app.use('/', pagesRoutes);

// DB associations

// DB & server start
sequelize
    .sync()
    // .sync({force: true})
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));