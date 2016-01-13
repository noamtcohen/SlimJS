/**
 * Created by noam on 1/5/16.
 */

var VOID = "/__VOID__/";
var path = require('path'),
    sandbox = require("./sandbox"),
    LOG = require("./udp-logger").log,
    helper = require("./SlimHelperLibrary");

function StatementExecutor(fixFolder) {
    var instances = {},
        library = [],
        symbolRepository = {},
        fixtureFolder = fixFolder;

    sandbox.addWorkingDirectory(fixFolder);

    addSlimHelperLibrary();

    this.import = function(ins,cb){
        var id = ins[0];

        var jsPath = path.join(fixtureFolder, ins[2] + ".js");

        sandbox.loadFile(jsPath, function (err) {
            if (err)
                return cb([id, toException(err)]);

            cb([id, "OK"]);
        });
    }

    this.make = function (ins, cb) {
        var id = ins[0];

        var instance = ins[2];
        var clazz = ins[3];

        if (classIsSingleSymbol(clazz)) {
            var symbol = symbolRepository[clazz.substr(1)];
            if (typeof symbol === 'string')
            {
                LOG("Use Symbol as class name: " + " "  + clazz);
                clazz = symbol;
            } else {
                LOG("Copy Symbol: " + instance + " "  + clazz);
                instances[instance] = symbol;
                return cb([id,'OK'])
            }
        }


        clazz= replaceAllSymbols(clazz);


        var args = ins.slice(4);

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

    this.call = function (ins, cb, symbolNameToAssignTo) {
        //LOG(JSON.stringify(ins));
        var id = ins[0];

        var instanceName = ins[2];
        var funName = ins[3];

        var args = ins.slice(4) || [];

        args.push(function (err, ret) {
            if (err)
                return cb([id, toException(err)]);

            if (symbolNameToAssignTo)
                symbolRepository[symbolNameToAssignTo] = ret;

            cb([id, (ret==null || ret==undefined)?VOID:ret]);
        });


        try {
            var theFunc = instances[instanceName][funName];
            if (!theFunc && (funName == 'beginTable' || funName == 'endTable' || funName == 'reset' || funName == 'execute' || funName == 'table'))
                return cb([id, VOID]);

            loadSybolValuesToArguments();

            theFunc.apply(instances[instanceName], args);
        }
        catch (e) {
            if (!instances[instanceName])
                cb([id, toException("?")]);
            else if(!instances[instanceName][funName])
                cb([id, toException( funName + " is not defined")]);
            else
                cb([id, toException( e)]);
        }

        function loadSybolValuesToArguments() {
            for (var i = 0; i < args.length; i++)
                if (args[i].toString().indexOf('$') === 0)
                    args[i] = symbolRepository[args[i].substr(1)];
        }

    }

    this.callAndAssign = function (ins, cb) {
        var symbolName = ins.splice(2, 1);

        this.call(ins, cb, symbolName);
    }

    this.assign = function (ins, cb) {
        var id = ins[0];
        var symbol = ins[2];
        var val = ins[3];
        symbolRepository[symbol] = val;

        cb([id, "OK"]);
    }

    this.setInstance = function(name,fixture){
        instances[name]=fixture;
    }

    this.instance =function(name){
        return instances[name]||null;
    }

    function addSlimHelperLibrary()
    {
        var slimHelper = new helper.SlimHelperLibrary();
        slimHelper.setStatementExecutor(this);

        instances[slimHelper.ACTOR_INSTANCE_NAME] = slimHelper;
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

        var symbolKeys = Object.keys(symbolRepository);
        for(var i=0;i<symbolKeys.length;i++)
        {
            var key = symbolKeys[i];
            if (typeof symbolRepository[key] === 'string'){
                var regx = new RegExp("\\$" + key,'g');
                clazz = clazz.replace(regx,symbolRepository[key]);
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

module.exports.StatementExecutor = StatementExecutor;