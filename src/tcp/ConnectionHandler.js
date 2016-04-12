/**
 * Created by noam on 1/18/16.
 */

var SlimParser = require("./SlimParser");

var slimParser = new SlimParser();
var BYE = "bye";

function ConnectionHandler(){
    var VERSION_LINE = "Slim -- V" + "0.4" + "\n";

    var buffer = "";
    var lenHeader;
    var payloadLength;
    var _socket;
    var doInstructionSet;
    this.setOnInstructionHandler = function(handler){
        doInstructionSet = handler;
    };

    this.handle = function(socket){
        _socket = socket;
        _socket.write(VERSION_LINE);
        _socket.on('data', processData);

        _socket.on("error",function(){
            process.exit(0);
        });
    };

    this.writeResult = function(executionResult){
        var slim = slimParser.stringify(executionResult);
        _socket.write(slim);
    };

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
        
        doInstructionSet(instruction);

        getReadyForNextPayload();
    }

    function getReadyForNextPayload(){
        buffer = "";
        lenHeader = null;
        payloadLength = null;
    }
}

module.exports = ConnectionHandler;