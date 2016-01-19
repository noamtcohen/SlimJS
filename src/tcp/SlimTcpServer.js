/**
 * Created by noam on 1/5/16.
 */


var net = require('net'),
    ConnectionHandler = require('./ConnectionHandler');


function SlimTcpServer(port, doInstructionSet) {
    this.start = function () {

        startServer();

        function startServer(){
            net.createServer(handleNewConnection).listen(port);
        }

        function handleNewConnection(socket){
            new ConnectionHandler(socket,doInstructionSet);
            //socket.write(VERSION_LINE);
            //
            //var buffer = "";
            //var lenHeader;
            //var payloadLength;
            //
            //socket.on('data', processData);
            //
            //function processData(data){
            //    appendDataToBuffer(data);
            //
            //    tryToParseLengthHeader();
            //
            //    tryToParsePayloadBody()
            //}
            //
            //function appendDataToBuffer(data){
            //    buffer += data.toString();
            //}
            //
            //function tryToParseLengthHeader(){
            //    if (payloadLengthHeaderHasArrived())
            //        parseLengthHeader();
            //}
            //
            //function tryToParsePayloadBody(){
            //    if (payloadBodyHasArrived())
            //        executeInstructionSet();
            //}
            //
            //function payloadLengthHeaderHasArrived() {
            //    return !payloadLength && buffer.indexOf(':') != -1;
            //}
            //
            //function payloadBodyHasArrived() {
            //    return buffer.length - lenHeader.length == payloadLength;
            //}
            //
            //function parseLengthHeader(){
            //    lenHeader = buffer.substr(0, buffer.indexOf(':') + 1);
            //    payloadLength = parseInt(lenHeader);
            //}
            //
            //function executeInstructionSet(t){
            //    var instructionArray = slimParser.parse(buffer.substr(lenHeader.length));
            //
            //    doInstructionSet(instructionArray, function (executionResult) {
            //        var slim = slimParser.stringify(executionResult);
            //        socket.write(slim);
            //    });
            //
            //    getReadyForNextPayload();
            //}
            //
            //function getReadyForNextPayload(){
            //    buffer = "";
            //    lenHeader = null;
            //    payloadLength = null;
            //}
        }
    }
}

module.exports = SlimTcpServer;