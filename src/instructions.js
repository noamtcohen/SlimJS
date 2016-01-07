/**
 * Created by noam on 1/5/16.
 */

var VOID = "/__VOID__/";
var path = require('path'),
    SearchPaths = require("./sandbox"),
    LOG = require("./udp-logger").log

module.exports.Instructions = Instructions;

var ObjectPool = {};
var Library = [];
var Symbols = {};
var fixtureFolder;

function Instructions(fixFolder) {
    fixtureFolder = fixFolder;
}

var proto = Instructions.prototype;

proto.import = function (ins, cb) {
    var id = ins[0];

    var jsPath = path.join(fixtureFolder, ins[2] + ".js");

    SearchPaths.loadFile(jsPath, function (err) {
        if (err)
            return cb([id, toException(err)]);

        cb([id, "OK"]);
    });
}

proto.make = function (ins, cb) {
    var id = ins[0];

    var instance = ins[2];
    var clazz = ins[3];

    if(clazz.indexOf('$')===0 && (typeof Symbols[clazz] !== 'string'))
    {
        LOG("Copy Symbol: " + instance + " "  + clazz);
        ObjectPool[instance] = Symbols[clazz.substr(1)];
        return cb([id,'OK'])
    }

    var args = ins.slice(4);

    var obj = SearchPaths.make(clazz, args);

    if (typeof obj === 'string')
        return cb([id, toException(obj)]);


    var isLibraryObject = instance.indexOf('library') === 0;
    if (isLibraryObject)
        Library.push({name:instance,value:obj});
    else
        ObjectPool[instance] = obj;

    cb([id, 'OK']);
}

proto.call = function (ins, cb, symbolNameToAssignTo) {
    var id = ins[0];

    var instanceName = ins[2];
    var funName = ins[3];

    var args = ins.slice(4) || [];

    args.push(function (err, ret) {
        if (err)
            return cb([id, toException(err)]);

        if (symbolNameToAssignTo)
        {
            LOG("Assign: " + symbolNameToAssignTo + "->"  +JSON.stringify(ret) + "->" + instanceName);
            Symbols[symbolNameToAssignTo] = ObjectPool[instanceName];//ret || VOID;
        }

        cb([id, ret ? ret.toString() : VOID]);
    });

    try {
        var theFunc = ObjectPool[instanceName][funName];
        if (!theFunc && (funName == 'beginTable' || funName == 'endTable' || funName == 'reset' || funName == 'execute' || funName == 'table'))
            return cb([id, VOID]);

        theFunc.apply(null, args);
    }
    catch (e) {
        if (!ObjectPool[instanceName])
            cb([id, toException("?")]);
        else if(!ObjectPool[instanceName][funName])
            cb([id, toException( funName + " is not defined")]);
        else
            cb([id, toException( e)]);
    }
}

proto.callAndAssign = function (ins, cb) {
    var symbolName = ins.splice(2, 1);

    this.call(ins, cb, symbolName);
}

proto.assign = function (ins, cb) {
    var id = ins[0];
    var symbol = ins[2];
    var val = ins[3];
    Symbols[symbol] = val;

    cb([id, "OK"]);
}

function toException(e) {
    if(e.stack)
        return "__EXCEPTION__:"+e.stack.toString();

    return "__EXCEPTION__:message:<<" + e.toString() + ">>";
}



