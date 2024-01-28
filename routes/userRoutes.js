const express = require('express');

const router = express.Router();

const signupController = require('../controller/signup');
const loginController = require('../controller/login');

router.post('/signup', signupController.signup);
router.post('/login', loginController.login);

module.exports = router;