const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const groupController = require('../controller/gorup');

router.post('/createGroup', auth.authenticate, groupController.createGroup);
router.get('/joinedGroups', auth.authenticate, groupController.joinedGroup);
router.get('/openGroup/:id', auth.authenticate, groupController.openGroup);
router.get('/groupDetails/:inviteId', auth.authenticate, groupController.groupDetails);
router.get('/joinMember/:groupId', auth.authenticate, groupController.joinMember);

module.exports = router;