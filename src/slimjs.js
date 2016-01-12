#! /usr/bin/env node

var path = require('path'),
    LOG = require("./udp-logger").log,
    slimtcp = require("./tcp-server.js"),
    instructions = require("./instructions.js"),
    classpath =  process.argv[process.argv.length - 2];


var fixtureFolder;

if(path.isAbsolute(classpath))
    fixtureFolder = classpath;
else
    fixtureFolder= path.join(process.cwd(), classpath);

var Instructions = new instructions.Instructions(fixtureFolder);

var tcpSlimServer = new slimtcp.SlimTcpServer(process.argv[process.argv.length - 1], onReceivedInstructionSet);
tcpSlimServer.start();

function onReceivedInstructionSet(arr, cb) {
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

    Instructions[cmd](ins, cb);
}


