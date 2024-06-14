const multer = require('multer');

const setPathForUploader = (path = './src/assets/files') => {
    try {
        const storage = multer.diskStorage({
            destination(req, file, cb) {
                cb(null, path);
            },
            filename(req, file, cb) {
                const name = `${Math.round(Math.random() * 1E9)}${file.originalname}`;
                cb(null, name);
            },
        });
        const upload = multer({ storage });
        return upload;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    setPathForUploader,
};