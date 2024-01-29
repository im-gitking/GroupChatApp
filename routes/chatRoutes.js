const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const chatController = require('../controller/chat');

router.post('/sendText', auth.authenticate , chatController.postTextMessage);
router.get('/getText', auth.authenticate , chatController.getMessage);
router.post('/realTime', auth.authenticate , chatController.newMessages);

module.exports = router;