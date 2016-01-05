/**
 * Created by noam on 1/5/16.
 */


(function (exports) {

    var fs = require('fs'),
        path = require('path'),
        SearchPaths = require("./search-paths")

    exports.Instructions = Instructions;

    function Instructions(fixtureFolder) {
        this.ObjectPool = {};
        this.Library = {};
        this.Symbols = {};
        this.fixtureFolder = fixtureFolder;
    }

    var proto = Instructions.prototype;

    proto.import = function (ins, cb) {
        var id = ins[0];

        var jsPath = path.join(this.fixtureFolder, ins[2] + ".js");

        fs.readFile(jsPath, function (err, jsfile) {

            if (!err)
                err = SearchPaths.load(jsfile.toString());

            if (err)
                return cb([id, toException(err)]);

            cb([id, "OK"]);
        });
    }

    proto.make = function (ins, cb) {
        var id = ins[0];

        var instanceName = ins[2];
        var instanceType = ins[3];

        var args = ins.slice(4);

        var obj = SearchPaths.make(instanceType, args);

        if (typeof obj === 'string')
            return cb([id, toException(obj)]);


        var isLibraryObject = instanceName.indexOf('library') === 0;
        if (isLibraryObject)
            this.Library[instanceName] = obj;
        else
            this.ObjectPool[instanceName] = obj;

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
                this.Symbols[symbolNameToAssignTo] = ret||VOID;

            cb([id, ret ? ret.toString() : VOID]);
        });

        try {
            var theFunc = this.ObjectPool[instanceName][funName];
            if (!theFunc && (funName == 'beginTable' || funName == 'endTable' || funName == 'reset' || funName == 'execute' || funName == 'table'))
                return cb([id, VOID]);

            theFunc.apply(null, args);
        }
        catch (e) {
            if (!this.ObjectPool[instanceName])
                cb([id, toException("?")]);
            else
                cb([id, toException(e)]);
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
        this.Symbols[symbol]=val;

        cb([id, "OK"]);
    }

    function toException(e) {
        return "__EXCEPTION__:message:<<" + e + ">> " + (e.stack || "");
    }

    var VOID = "/__VOID__/";

}(module.exports));