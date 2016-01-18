/**
 * Created by noam on 1/5/16.
 */

var VOID = "/__VOID__/";
var path = require('path'),
    Sandbox = require("./../Sandbox"),
    LOG = require("./../utils/LOG").LOG,
    helper = require("./../SlimHelperLibrary");

function StatementExecutor(fixFolder) {
    var instances = {},
        library = [],
        symbols  = {},
        fixtureFolder = fixFolder,
        sandbox = new Sandbox();

    sandbox.addWorkingDirectory(fixFolder);

    addSlimHelperLibrary(this);

    this.import = function(instructionArgument,cb){
        var id = instructionArgument[0];

        var jsPath = path.join(fixtureFolder, instructionArgument[2] + ".js");

        sandbox.loadFile(jsPath, function (err) {
            if (err)
                return cb([id, toException(err)]);

            cb([id, "OK"]);
        });
    }

    this.make = function (instructionArgument, cb) {
        var id = instructionArgument[0];
        var instance = instructionArgument[2];
        var clazz = instructionArgument[3];

        if(classIsSingleSymbol(clazz)){
            var symbol = symbols[clazz.substr(1)];
            if(typeof symbol !== 'string')
            {
                instances[instance] = symbol;
                return cb([id,'OK'])
            }
        }

        clazz= replaceAllSymbols(clazz);

        var args = instructionArgument.slice(4);

        var obj = sandbox.make(clazz, args);

        if (typeof obj === 'string')
            return cb([id, toException(obj)]);


        var isLibraryObject = instance.indexOf('library') === 0;
        if (isLibraryObject)
            library.push({name:instance,value:obj});
        else
            instances[instance] = obj;

        cb([id, 'OK']);
    }

    this.call = function (instructionArgument, cb, symbolNameToAssignTo) {
        var id = instructionArgument[0];

        var instanceName = instructionArgument[2];
        var funName = instructionArgument[3];

        var args = instructionArgument.slice(4) || [];

        var theFunc = instances[instanceName][funName];
        var applyOnObject = instances[instanceName];

        try {
            if (!theFunc && isOptionalFunction(funName))
                return cb([id, VOID]);

            loadSybolValuesToArguments(args);

            if(!theFunc)
                tryToGetSUT();

            if(!theFunc)
                tryToGetLibraryObject();

            if(!applyOnObject)
                throw "NO_INSTANCE " + instanceName;

            if(!theFunc)
                throw "NO_METHOD_IN_CLASS " + funName;

            var funReturn = theFunc.apply(applyOnObject, args);

            if(typeof funReturn === 'undefined')
                return cb([id,VOID]);

            if(!isPromise(funReturn)){
                if (symbolNameToAssignTo)
                    symbols[symbolNameToAssignTo] = funReturn;

                return cb([id, funReturn]);
            }

            funReturn.then(function(val){

                if (symbolNameToAssignTo)
                    symbols[symbolNameToAssignTo] = val;

                cb([id,val]);

            },function(err){
                cb([id, toException(err)]);
            });
        }
        catch (e) {
            cb([id, toException( e)]);
        }

        function tryToGetSUT() {
            if (instances[instanceName].sut && typeof instances[instanceName].sut === 'function') {
                var systemUnderTest = instances[instanceName].sut();

                if (systemUnderTest[funName]) {
                    theFunc = systemUnderTest[funName];
                    applyOnObject = systemUnderTest;
                }
            }
        }

        function tryToGetLibraryObject() {
            for (var i = library.length - 1; i >= 0; i--) {
                if (library[i].name === instanceName && library[i].value[funName]) {
                    theFunc = library[i].value[funName];
                    applyOnObject = library[i].value;
                    break;
                }
            }
        }
    }

    this.callAndAssign = function (instructionArgument, cb) {
        var symbolName = instructionArgument.splice(2, 1);

        this.call(instructionArgument, cb, symbolName);
    }

    this.assign = function (ins, cb) {
        var id = ins[0];
        var symbol = ins[2];
        var val = ins[3];
        symbols[symbol] = val;

        cb([id, "OK"]);
    }

    this.setInstance = function(name,fixture){
        instances[name]=fixture;
    }

    this.instance =function(name){
        return instances[name]||null;
    }

    function isPromise(funReturn) {
        return funReturn.then && typeof funReturn.then === 'function';
    }

    function loadSybolValuesToArguments(args) {
        for (var i = 0; i < args.length; i++)
            if (args[i].toString().indexOf('$') === 0)
                args[i] = symbols[args[i].substr(1)];
    }

    function isOptionalFunction(funName){
        return (funName == 'beginTable' || funName == 'endTable' || funName == 'reset' || funName == 'execute' || funName == 'table');
    }

    function addSlimHelperLibrary(executer)
    {
        var slimHelper = new helper.SlimHelperLibrary();
        slimHelper.setStatementExecutor(executer);

        library.push({name:slimHelper.ACTOR_INSTANCE_NAME,value:slimHelper});
    }

    function classIsSingleSymbol(clazz){
        return clazz.indexOf('$')===0 && clazz.match(/$/g).length==1;
    }

    function needToReplaceSymbols(clazz){
        return clazz.indexOf('$')!==-1;
    }

    function replaceAllSymbols(clazz){
        if(!needToReplaceSymbols(clazz))
            return clazz;

        var symbolKeys = Object.keys(symbols);
        for(var i=0;i<symbolKeys.length;i++)
        {
            var key = symbolKeys[i];
            if (typeof symbols[key] === 'string'){
                var regx = new RegExp("\\$" + key,'g');
                clazz = clazz.replace(regx,symbols[key]);
            }
        }

        return clazz;
    }

    function toException(e) {
        if(e.stack)
            return "__EXCEPTION__:"+e.stack.toString();

        return "__EXCEPTION__:message:<<" + e.toString() + ">>";
    }
}

module.exports = StatementExecutor;