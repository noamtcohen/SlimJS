/**
 * Created by noam on 1/3/16.
 */

var vm = require('vm'),
    fs = require('fs'),
    path = require('path'),
    LOG = require("./utils/LOG").LOG;

function Sandbox(arrayOfSearchPaths){
    var scriptsContext = {
        require: require,
        process:process,
        LOG:LOG,

        make: function (name, args,cb) {
            if (!args)
                args = [];

            try {
                var ns = name.split('.');

                var theType = this[ns[0]];
                for (var i = 1; i < ns.length; i++)
                    theType = theType[ns[i]];

                if(!theType)
                    return cb("NO_CLASS " + name,null);

                var obj = construct(theType, args);
                cb(null,obj);
            }
            catch (e) {
                cb(Error(e),null);
            }

            function construct(T) {
                function F() {
                    return T.apply(this, args);
                }

                F.prototype = T.prototype;
                return new F();
            }
        }
    };

    vm.createContext(scriptsContext);

    this.addWorkingDirectory = function(workingDirectory){
        module.paths.push(workingDirectory);
    }

    this.make = function (name, args,cb) {
        scriptsContext.make(name, args,cb);
    }

    this.loadFile = function (name, cb) {
        for(var i=0;i<arrayOfSearchPaths.length;i++){
            var jsPath=path.join(arrayOfSearchPaths[i],name +'.js');
            if(fileExists(jsPath))
                return loadFileIntoScriptContext(jsPath,cb);
        }

        cb("File not found: " + name);
    }

    function fileExists(jsPath){
        try {
            fs.accessSync(jsPath, fs.F_OK);
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadFileIntoScriptContext(jsPath,cb){
        var js = fs.readFileSync(jsPath,'utf8');
        try {
            vm.runInContext(js, scriptsContext, jsPath + ".vm");
            cb(null);
        }
        catch (e) {
            cb(new Error(e));
        }
    }

    for(var i=0;i<arrayOfSearchPaths.length;i++)
        this.addWorkingDirectory(arrayOfSearchPaths[i]);
}

module.exports=Sandbox;