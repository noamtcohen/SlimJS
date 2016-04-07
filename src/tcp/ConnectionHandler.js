/**
 * Created by noam on 1/18/16.
 */

var SlimParser = require("./SlimParser");

var slimParser = new SlimParser();
var BYE = "bye";

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
        var instructionData = buffer.substr(lenHeader.length);

        var instruction;
        if(instructionData===BYE)
            instruction = BYE;
        else
            instruction = slimParser.parse(instructionData);
        
        doInstructionSet(instruction, function (executionResult) {
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