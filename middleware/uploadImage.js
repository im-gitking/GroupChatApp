const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: process.env.AWS_USER_KEY,
    secretAccessKey: process.env.AWS_USER_SECRET
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'expensetracker000',
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

exports.imageUpload = function (req, res, next) {
    upload.array('uploadFile')(req, res, function(err) {
        console.log(req.files);
        console.log(1234);
        
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(500).json(err);
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json(err);
        }
        // Everything went fine and file is uploaded
        res.send('Successfully uploaded ' + req.files.length + ' files!');
        next();
    });
};

