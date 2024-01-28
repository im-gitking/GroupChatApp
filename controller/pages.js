const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '../');

// If path valid - process, If path not found - 404
const pathChecker = (filePath, res) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('404 - ', filePath);
            res.status(404).sendFile(path.join(rootDir, 'public/html/404.html'));
        } else {
            console.log('File exists');
            res.status(200).sendFile(filePath);
        }
    });
}

// exports.signupPage = (req, res, next) => {
//     const filePath = path.join(rootDir, `public/html/signup.html`);
//     console.log(req.url, ' - Page');
//     pathChecker(filePath, res);
// };

exports.pageSender = (req, res, next) => {
    const filePath = path.join(rootDir, `public/html/${req.url}.html`);
    console.log(req.url, ' - Page');
    pathChecker(filePath, res);
};

exports.helperJsPages = (req, res, next) => {
    const filePath = path.join(rootDir, `public/js/${req.url}`);
    console.log(req.url, ' - JS');
    pathChecker(filePath, res);
}

exports.helperCssPages = (req, res, next) => {
    const filePath = path.join(rootDir, `public/css/${req.url}`);
    console.log(req.url, ' - CSS');
    pathChecker(filePath, res);
}

exports.NotFoundPage = (req, res, next) => {
    console.log(req.url, ' - 404');
    res.status(404).sendFile(path.join(rootDir, 'public/html/404.html'));
}