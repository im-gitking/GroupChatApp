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
const chatRoutes = require('./routes/chatRoutes');

const pagesRoutes = require('./routes/pagesRoutes');

// Models
const User = require('./models/user');
const Message = require('./models/message');

// API Routing
app.use((req, res, next) => {
    console.log(req.url);
    next();
})

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Pages Routing
app.use('/', pagesRoutes);

// DB associations
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

// DB & server start
sequelize
    .sync()
    // .sync({force: true})
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));