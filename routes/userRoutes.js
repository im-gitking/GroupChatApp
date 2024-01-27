const express = require('express');

const router = express.Router();

const signupController = require('../controller/signup');

router('/', signupController);

module.exports = router;