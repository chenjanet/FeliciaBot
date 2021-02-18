const request = require('request');

module.exports.getRequest = async(url, callback) => {
    console.log(url);
    request.get(url, { json: true }, async (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        callback(res);
    });
}