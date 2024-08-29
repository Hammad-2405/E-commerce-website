const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: "../../frontend/public/uploads",
    filename: (req, file, cb) => {
        // console.log(file, "file")
        cb(null, `${new Date().getTime()} - ${file.originalname}`)
        // cb(true , false)  throw == >error
        // cb(false , true) ==> success
    },

})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    },
});

module.exports = upload;