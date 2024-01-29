const express = require('express');
const path = require('path');

const rootDir = path.resolve(__dirname, '../');
const router = express.Router();

const pagesController = require('../controller/pages');

// For HTML Pages
// router.get('/signup', pagesController.signupPage);
router.get('/signup', pagesController.pageSender);
router.get('/login', pagesController.pageSender);
router.get('/home', pagesController.pageSender);
router.get('/group', pagesController.pageSender);

// For JS, CSS Pages
router.use('/js', pagesController.helperJsPages);
router.use('/css', pagesController.helperCssPages);

// For 404 Page
router.use('/', pagesController.NotFoundPage);

module.exports = router;