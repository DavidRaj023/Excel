const fs = require('fs')

exports.deleteFile = (path) => {
    try {
        fs.unlinkSync(path);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}