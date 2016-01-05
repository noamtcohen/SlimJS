(function () {
    var path = require('path'),
        LOG = require("./udp-logger").log,
        slimtcp = require("./tcp-server.js"),
        instructions = require("./instructions.js");

    var fixtureFolder = path.join(process.cwd(), process.argv[process.argv.length - 2]);

    var ObjectPool = {};
    var Symbols = {};
    var LibraryInstances = [];
    var Actors = [];

    var Instructions = new instructions.Instructions(ObjectPool,fixtureFolder);

    var tcpSlimServer = new slimtcp.SlimTcpServer(process.argv[process.argv.length - 1],onReceivedInstructionSet);
    tcpSlimServer.start();

    function onReceivedInstructionSet(arr, cb) {

        LOG(">> " + JSON.stringify(arr));

        var ret = [];

        var currentInstructionIndex = 0;

        function onResult(result) {
            ret.push(result);

            currentInstructionIndex++;

            if (currentInstructionIndex < arr.length)
                doInstruction(arr[currentInstructionIndex], onResult);
            else
                cb(ret);
        }

        doInstruction(arr[0], onResult);
    }

    function doInstruction(ins, cb) {
        var cmd = ins[1];

        if (cmd === 'import')
            Instructions.import(ins,cb);

        if (cmd === 'make')
            Instructions.make(ins,cb);

        if (cmd == 'call')
            Instructions.call(ins,cb);
    }
}());

//function exit(){
//    //this.socket.destroy();
//    server.close();
//};

