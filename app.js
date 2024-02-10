// Imported Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();
const socketIo = require('socket.io');
// const { instrument } = require('@socket.io/admin-ui');

// Using packages
const app = express();
const server = require('http').createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://13.53.193.195:3000', 'https://admin.socket.io'],
        // origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
});
app.use(bodyParser.json());
app.use(cors());

// instrument(io, { auth: false });

// Required Paths
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const adminRoutes = require('./routes/adminRoutes');

const websocketAuth = require('./middleware/websocketAuth');
const connectionListener = require('./websocket/connectionListener');

const pagesRoutes = require('./routes/pagesRoutes');

// Models
const User = require('./models/user');
const Message = require('./models/message');
const Member = require('./models/member');
const Group = require('./models/group');

// Authenticaton of WebSocket Connection request
io.use(websocketAuth);

// socket.io all event listeners and actions
io.on('connection', connectionListener);

// HTTP API Routing
app.use((req, res, next) => {
    req.io = io;
    console.log(req.url);
    next();
})

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);
app.use('/admin', adminRoutes);

// Pages Routing
app.use('/', pagesRoutes);

// DB associations
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

Group.hasMany(Member, { foreignKey: 'groupId' });
Member.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Member, { foreignKey: 'userId' });
Member.belongsTo(User, { foreignKey: 'userId' });

// DB & server start
sequelize
    .sync()
    // .sync({force: true})
    .then(result => {
        // console.log(result);
        server.listen(3000);
    })
    .catch(err => console.log(err));
