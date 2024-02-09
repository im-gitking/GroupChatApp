const express = require('express');

const router = express.Router();

const uploadImage = require('../middleware/uploadImage');

const chatController = require('../controller/chat');

router.post(uploadImage.imageUpload, chatController.postMessage);
router.get(chatController.getMessage);
router.post(chatController.newMessages);

module.exports = router;