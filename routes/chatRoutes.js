const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const chatController = require('../controller/chat');

router.post('/sendText', auth.authenticate , chatController.postTextMessage);
router.get('/getText/:groupId', auth.authenticate , chatController.getMessage);
router.post('/realTime/:groupId', auth.authenticate , chatController.newMessages);

module.exports = router;