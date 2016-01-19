/**
 * Created by noam on 1/18/16.
 */

var SlimParser = require("./SlimParser");

var slimParser = new SlimParser();

function ConnectionHandler(socket,doInstructionSet){
    var VERSION_LINE = "Slim -- V" + "0.4" + "\n";

    socket.write(VERSION_LINE);

    var buffer = "";
    var lenHeader;
    var payloadLength;

    socket.on('data', processData);

    function processData(data){
        appendDataToBuffer(data);

        tryToParseLengthHeader();

        tryToParsePayloadBody()
    }

    function appendDataToBuffer(data){
        buffer += data.toString();
    }

    function tryToParseLengthHeader(){
        if (payloadLengthHeaderHasArrived())
            parseLengthHeader();
    }

    function payloadLengthHeaderHasArrived() {
        return !payloadLength && buffer.indexOf(':') != -1;
    }

    function parseLengthHeader(){
        lenHeader = buffer.substr(0, buffer.indexOf(':') + 1);
        payloadLength = parseInt(lenHeader);
    }

    function tryToParsePayloadBody(){
        if (payloadBodyHasArrived())
            executeInstructionSet();
    }

    function payloadBodyHasArrived() {
        return buffer.length - lenHeader.length == payloadLength;
    }

    function executeInstructionSet(t){
        var instructionArray = slimParser.parse(buffer.substr(lenHeader.length));

        doInstructionSet(instructionArray, function (executionResult) {
            var slim = slimParser.stringify(executionResult);
            socket.write(slim);
        });

        getReadyForNextPayload();
    }

    function getReadyForNextPayload(){
        buffer = "";
        lenHeader = null;
        payloadLength = null;
    }
}

module.exports = ConnectionHandler;