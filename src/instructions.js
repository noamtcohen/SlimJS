/**
 * Created by noam on 1/5/16.
 */


(function(exports){

    var fs = require('fs'),
        path = require('path'),
        SearchPaths = require("./search-paths")

    exports.Instructions = Instructions;

    function Instructions(ObjectPool,fixtureFolder){
        this.ObjectPool = ObjectPool;
        this.fixtureFolder = fixtureFolder;
    }

    var proto = Instructions.prototype;

    proto.import = function(ins,cb){
        var id = ins[0];

        var jsPath = path.join(this.fixtureFolder, ins[2] + ".js");

        fs.readFile(jsPath, function (err, jsfile) {

            if(!err)
                err = SearchPaths.load(jsfile.toString());

            if(err)
                return cb([id, toException(err)]);

            cb([id, "OK"]);
        });
    }

    proto.make = function(ins,cb){
        var id = ins[0];

        var instanceName = ins[2];
        var instanceType = ins[3];

        var args = ins.slice(4);

        var obj = SearchPaths.make(instanceType, args);

        if(typeof obj === 'string')
            return cb([id,toException(obj)]);


        this.ObjectPool[instanceName] = obj;

        cb([id, 'OK']);
    }

    proto.call = function(ins,cb){
        var id = ins[0];

        var instanceName = ins[2];
        var funName = ins[3];

        var isDecisionTable = instanceName.indexOf("decisionTable")===0;
        var isSetFunction = funName.indexOf('set')===0;


        var args = ins.slice(4) || [];

        if(!isSetFunction) {
            args.push(function (err, ret) {
                if (err)
                    return cb([id, toException(err)]);

                cb([id, ret.toString()]);
            });
        }

        try{
            var theFunc = this.ObjectPool[instanceName][funName];
            if(isDecisionTable && !theFunc && (funName=='beginTable' || 'endTable' || 'reset' || 'execute' || 'table'))
                return cb([id,"OK"]);

            theFunc.apply(null, args);

            if(isSetFunction)
                cb([id,"OK"]);
        }
        catch(e){
            if(!this.ObjectPool[instanceName])
                cb([id,toException("?")]);

            cb([id,toException(e)]);
        }
    }

    function toException(e){
        return "__EXCEPTION__:message:<<"+e+">> " + (e.stack || "");
    }

}(module.exports));