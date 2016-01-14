/**
 * Created by noamc on 1/3/16.
 */


var dgram = require("dgram");
var server = dgram.createSocket("udp4");
server.on("error", function (err) {
    console.error("server error:\n" + err.stack);
});

server.on("message", function (data, rinfo) {
    console.log(data.toString());
});

server.bind(9999);

var client = dgram.createSocket("udp4");
module.exports.log = function (msg) {
    var message = new Buffer(msg);
    client.send(message, 0, message.length, 9999, "localhost", function (err) {

    });
}
