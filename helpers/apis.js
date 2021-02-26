const request = require('request');

module.exports.getRequest = async(url, return_val, callback) => {
    request.get(url, { json: true }, async (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if (return_val == "res") {
            callback(res);
        } else if (return_val == "body") {
            callback(body);
        }
    });
}