const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const adminController = require('../controller/admin');

router.get('/membersDetails/:groupId', auth.authenticate , adminController.getAllMembers);

module.exports = router;