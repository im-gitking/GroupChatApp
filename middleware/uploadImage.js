const multer = require('multer');

// const upload = multer({ dest: "uploads/" });     //for simple ulpoad, diskStorage() for more control

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get the type of file. 
        const ext = file.mimetype.split("/")[0];
        // if type is image -> store in 'uploads/image' else in 'uploads/others'
        if (ext === "image") {
            cb(null, "uploads/images");
        } else {
            cb(null, "uploads/others");
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname}`);
    }
});

// Use diskstorage option in multer
const upload = multer({ storage: multerStorage });

exports.imageUpload = async function (req, res, next) {
    // upload image
    upload.single('image')(req, res, function (err) {
        console.log("Body: ", req.body.text);
        console.log("File: ", req.file);
        
        if(req.file != undefined) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(1);
                return res.status(500).json(err);
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log(2);
                return res.status(500).json(err);
            }
    
            console.log(req.file.path);
            // res.send("File successfully uploaded.");
            next();
        }
        else {
            next();
        }
    });
};