/**
 * Created by noam on 1/18/16.
 */

var VOID = "/__VOID__/";

var ExecUtils = require('./ExecUtils'),
    utils = new ExecUtils();

function CallExecutor(state){
    this.call = function (instructionArgument, cb, symbolNameToAssignTo) {
        var id = instructionArgument[0];

        var instanceName = instructionArgument[2];
        var funName = instructionArgument[3];

        var args = instructionArgument.slice(4) || [];

        var applyOnObject = state.getInstance(instanceName);

        var theFunc = applyOnObject?applyOnObject[funName]:null;

        try {
            if (!theFunc && isOptionalFunction(funName))
                return cb([id, VOID]);

            loadSybolValuesToArguments(args);

            if(!theFunc)
                tryToGetSUT();

            if(!theFunc)
                tryToGetLibraryObject();

            if(!applyOnObject)
                return cb([id, utils.toException("NO_INSTANCE " + instanceName)]);

            if(!theFunc)
                return cb([id, utils.toException("NO_METHOD_IN_CLASS " + funName + " " + applyOnObject.constructor.name)]);

            var funReturn = theFunc.apply(applyOnObject, args);

            if(typeof funReturn === 'undefined')
                return cb([id,VOID]);

            if(!isPromise(funReturn)){
                if (symbolNameToAssignTo)
                    state.setSymbol(symbolNameToAssignTo,funReturn);

                return cb([id, funReturn]);
            }

            funReturn.then.call(applyOnObject,function(val){

                if (symbolNameToAssignTo)
                    state.setSymbol(symbolNameToAssignTo,val);

                cb([id,val]);

            },function(err){
                cb([id, utils.toException(err)]);
            });
        }
        catch (e) {
            cb([id, utils.toException( e)]);
        }

        function tryToGetSUT() {
            var systemUnderTest = state.getSut(instanceName);

            if(systemUnderTest && systemUnderTest[funName]){
                theFunc = systemUnderTest[funName];
                applyOnObject = systemUnderTest;
            }
        }

        function tryToGetLibraryObject() {
            var libraryObject = state.getLibraryObject(instanceName,funName);
            if(libraryObject){
                theFunc = libraryObject[funName];
                applyOnObject = libraryObject;
            }
        }
    };

    this.callAndAssign = function (instructionArgument, cb) {
        var symbolName = instructionArgument.splice(2, 1);

        this.call(instructionArgument, cb, symbolName);
    };


    function loadSybolValuesToArguments(args) {
        for (var i = 0; i < args.length; i++)
            if (args[i].toString().indexOf('$') === 0)
                args[i] = state.getSymbol(args[i].substr(1));
    }

    function isPromise(obj) {
        return obj.then && typeof obj.then === 'function';
    }

    function isOptionalFunction(funName){
        return (funName == 'beginTable' || funName == 'endTable' || funName == 'reset' || funName == 'execute' || funName == 'table');
    }
}

module.exports =CallExecutor;
