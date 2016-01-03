

var net = require('net'),
    fs = require('fs'),
    path =require('path'),
    LOG = require("./udp-logger").log,
    parser = require("./slim-parser").SlimParser,
    SearchPaths = require("./search-paths");

var fixtureFolder = path.join(process.cwd(),process.argv[process.argv.length - 2]);
LOG(fixtureFolder);


var CreatedObjects = {};
var Symbols = {};
var LibraryInstances = [];
var Actors=[];


var SlimParser  = new parser();

var server = net.createServer(function(socket) {
    socket.write("Slim -- V" + "0.4" + "\n");

    var buf = "";
    var lenHeader;
    var instructionLength;

    socket.on('data', function(data){
        buf += data.toString();
        if(!instructionLength && buf.indexOf(':')!=-1){
            lenHeader = buf.substr(0,buf.indexOf(':')+1);
            instructionLength = parseInt(lenHeader);
        }
        if(buf.length-lenHeader.length==instructionLength)
        {
            var instructionArray = SlimParser.parse(buf.substr(lenHeader.length));

            doInstructionSet(instructionArray,function(result){
                var slim = SlimParser.stringify(result);
                socket.write(slim);
            });

            buf="";
            lenHeader=null;
            instructionLength=null;
        }
    });

}).listen(process.argv[process.argv.length - 1]);

function doInstructionSet(arr, cb){

    LOG(">> " + JSON.stringify(arr));

    var ret = [];

    var currentInstructionIndex = 0;

    function onResult(result){
        ret.push(result);

        currentInstructionIndex++;

        if(currentInstructionIndex<arr.length)
            doInstruction(arr[currentInstructionIndex],onResult);
        else
            cb(ret);
    }

    doInstruction(arr[0],onResult);

    function doInstruction(ins,cb){
        var id = ins[0];
        var cmd = ins[1];

        if(cmd==='import'){
            var jsPath = path.join(fixtureFolder,ins[2]+".js");


            fs.readFile(jsPath,function(err,jsfile){

                SearchPaths.load(jsfile.toString());

                cb([id,"OK"]);
            });
        }

        if(cmd==='make')
        {
            var instanceName = ins[2];
            var instanceType = ins[3];

            var args = ins.slice(4);

            CreatedObjects[instanceName] = SearchPaths.make(instanceType,args);
            cb([id,'OK']);
        }

        if(cmd=='call'){
            var instanceName = ins[2];
            var funName = ins[3];

            var args = ins.slice(4);

            args.push(function(ret){
                cb([id,ret]);
            });

            CreatedObjects[instanceName][funName].apply(null,args);
        }
    }
}


//function exit(){
//    //this.socket.destroy();
//    server.close();
//};

