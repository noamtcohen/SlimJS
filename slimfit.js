

var net = require('net'),path =require('path'),LOG = require("./udp-logger").log, parser = require("./slim-parser").SlimParser;

var fixtureFolder = path.join(process.cwd(),process.argv[process.argv.length - 2]);
LOG(fixtureFolder);

var SearchPaths = [];
var CreatedObjects = {};
var Symbols = {};
var LibraryInstances = [];
var Actors=[];

var SlimParser  = new parser();

var server = net.createServer(function(socket) {
    socket.write("Slim -- V" + "0.4" + "\n");

    var buf = "";
    var instructionLength=-1;

    socket.on('data', function(data){
        buf += data.toString();
        if(buf.indexOf(':')!=-1){
            var lenHeader = buf.substr(0,buf.indexOf(':')+1);
            instructionLength = parseInt(lenHeader);
        }
        if(buf.length-lenHeader.length==instructionLength)
        {
            doInstruction(buf.substr(lenHeader.length),socket);
            buf="";
        }
    });

}).listen(process.argv[process.argv.length - 1]);

function doInstruction(instruction,socket){
    var arr = SlimParser.parse(instruction);

    LOG(">> " + JSON.stringify(arr));

    for(var i=0;i<arr.length;i++)
    {
        var ins  =arr[i];
        var id = ins[0];
        var cmd = ins[1];
        if(cmd==='import'){
            SearchPaths.push(ins[2]);
            var slim = SlimParser.stringify([[id,"OK"]]);

            socket.write(slim);
        }
    }
}

function exit(){
    //this.socket.destroy();
    server.close();
};