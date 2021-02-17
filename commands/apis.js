const request = require('request');

module.exports.getRequest = async(url, callback) => {
    request.get(url, { json: true }, async (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        callback(res);
    });
}