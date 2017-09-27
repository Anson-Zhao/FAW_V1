var multer = require('multer');

var filePathName = "";

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/Users/imacbig04/Desktop/Test');
    },
    filename: function (req, file, callback) {
        //console.log(file.fieldname + " " + file.originalname);
        filePathName += file.fieldname + '-' + file.originalname + ",";
        callback(null, file.fieldname + '-' + file.originalname);
    }
});

var fileUpload = multer({ storage : storage}).any();

module.exports = {
    'function': fileUpload,
    'fileName': filePathName
};