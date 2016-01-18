#! /usr/bin/env node

var path = require('path'),
    LOG = require("./utils/LOG").LOG,
    SlimTcpServer = require("./tcp/SlimTcpServer.js"),
    StatementExecutor = require("./execution/StatementExecutor.js"),
    classpath =  process.argv[process.argv.length - 2],
    port = process.argv[process.argv.length - 1];


new SlimJS(port,classpath);

function SlimJS(port,classpath){
    var statementExecutor = new StatementExecutor(getAbsultePathToFixtureFolder(classpath));

    var tcpSlimServer = new SlimTcpServer(port, onReceivedInstructionSet);
    tcpSlimServer.start();

    function onReceivedInstructionSet(instructionSet, onFinalInstructionExecuted) {
        var returnValues = [];

        var currentInstructionIndex = 0;

        executeInstruction(instructionSet[0], onInstructionExecutionResult);

        function onInstructionExecutionResult(result) {
            returnValues.push(result);

            currentInstructionIndex++;

            if (wasLastInstructionExecuted())
                onFinalInstructionExecuted(returnValues);
            else
                executeInstruction(instructionSet[currentInstructionIndex], onInstructionExecutionResult);
        }

        function wasLastInstructionExecuted() {
            return currentInstructionIndex === instructionSet.length;
        }
    }

    function executeInstruction(instructionArguments, cb) {
        var command = instructionArguments[1];

        statementExecutor[command](instructionArguments, cb);
    }

    function getAbsultePathToFixtureFolder(classpath) {
        if (path.isAbsolute(classpath))
            return classpath;
        else
            return path.join(process.cwd(), classpath);
    }
}





