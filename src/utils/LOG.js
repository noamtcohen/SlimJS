/**
 * Created by noamc on 1/3/16.
 */


var dgram = require("dgram"),
    client = dgram.createSocket("udp4");

module.exports.LOG = function (msg) {
    var message = new Buffer(msg);
    client.send(message, 0, message.length, 9999, "localhost", function (err) {});
}
