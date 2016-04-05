/**
 * Created by noam on 1/3/16.
 */

var vm = require('vm'),
    fs = require('fs'),
    path = require('path');

function Sandbox(arrayOfSearchPaths){
    var scriptsContext = {
        require: require,
        process:process,
        console:console,
        theRequireArrayOfTheTestFixtures:[],

        make: function (name, args,cb) {
            if (!args)
                args = [];

            try {
                var ns = name.split('.');

                var theType;

                for(var v=0;v<this["theRequireArrayOfTheTestFixtures"].length;v++)
                {
                    theType = this["theRequireArrayOfTheTestFixtures"][v][ns[0]];

                    for (var i = 1; i < ns.length; i++)
                    {
                        if(!theType)
                            continue;

                        theType = theType[ns[i]];
                    }

                    if(theType)
                        break;
                }

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

    this.make = function (name, args,cb) {
        scriptsContext.make(name, args,cb);
    }

    this.loadFile = function (name, cb) {
        for(var i=0;i<arrayOfSearchPaths.length;i++){
            var jsPath=path.resolve(path.join(arrayOfSearchPaths[i],name +'.js'));
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
        var js = "theRequireArrayOfTheTestFixtures.push(require('"+jsPath+"'))";
        try {
            vm.runInContext(js, scriptsContext, jsPath + ".vm");
            cb(null);
        }
        catch (e) {
            cb(new Error(e));
        }
    }
}

module.exports=Sandbox;