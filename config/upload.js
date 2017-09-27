var multer = require('multer');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/Users/imacbig02/Desktop/Test');
    },
    filename: function (req, file, callback) {
        //console.log(file.fieldname + " " + file.originalname);
        callback(null, file.fieldname + '-' + file.originalname);
    }
});

var upload = multer({ storage : storage}).any();

module.exports = upload;