/**
 * Created by noam on 1/5/16.
 */


var net = require('net'),
    ConnectionHandler = require('./ConnectionHandler');


function SlimTcpServer(port) {

    var handler = new ConnectionHandler();

    this.setOnInstructionArrived = function(onInstruction){
        handler.setOnInstructionHandler(onInstruction);
    }

    this.writeResult = function(result){
        handler.writeResult(result);
    };

    this.start = function () {

        startServer();
        var server;
        function startServer(){
            server = net.createServer(handleNewConnection).listen(port);
        }

    }


    function handleNewConnection(socket){
        handler.handle(socket);
    }
}

module.exports = SlimTcpServer;