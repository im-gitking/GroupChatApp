const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const chatController = require('../controller/chat');

router.post('/sendText', auth.authenticate , chatController.postTextMessage);

module.exports = router;