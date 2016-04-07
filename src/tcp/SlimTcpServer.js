/**
 * Created by noam on 1/5/16.
 */


var net = require('net'),
    ConnectionHandler = require('./ConnectionHandler');


function SlimTcpServer(port, doInstructionSet) {
    this.start = function () {

        startServer();
        var server;
        function startServer(){
            server = net.createServer(handleNewConnection).listen(port);
        }

        function handleNewConnection(socket){
            socket.on("error",function(e){
                if(fitNesseClosedConnection(e))
                    server.close();
                else
                    throw e;
            });

            new ConnectionHandler(socket,doInstructionSet);
        }

        function fitNesseClosedConnection(e){
            return e.code==='ECONNRESET';
        }
    }
}

module.exports = SlimTcpServer;