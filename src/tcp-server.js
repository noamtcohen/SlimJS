/**
 * Created by noam on 1/5/16.
 */


var net = require('net'),
    parser = require("./slim-parser").SlimParser,
    SlimParser = new parser()

module.exports.SlimTcpServer = function (port, doInstructionSet) {
    this.start = function () {
        var server = net.createServer(function (socket) {
            socket.write("Slim -- V" + "0.4" + "\n");

            var buf = "";
            var lenHeader;
            var instructionLength;

            socket.on('data', function (data) {
                buf += data.toString();
                if (!instructionLength && buf.indexOf(':') != -1) {
                    lenHeader = buf.substr(0, buf.indexOf(':') + 1);
                    instructionLength = parseInt(lenHeader);
                }
                if (buf.length - lenHeader.length == instructionLength) {
                    var instructionArray = SlimParser.parse(buf.substr(lenHeader.length));

                    doInstructionSet(instructionArray, function (result) {
                        var slim = SlimParser.stringify(result);
                        socket.write(slim);
                    });

                    buf = "";
                    lenHeader = null;
                    instructionLength = null;
                }
            });

        }).listen(port);
    }
}
