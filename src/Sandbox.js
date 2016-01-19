/**
 * Created by noam on 1/3/16.
 */

var vm = require('vm'),
    fs = require('fs'),
    LOG = require("./utils/LOG").LOG;

function Sandbox(){

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

    this.loadFile = function (path, cb) {
        fs.readFile(path,'utf8', function (err, js) {
            if (err)
                return cb(err);
            try {
                vm.runInContext(js, scriptsContext, path + ".vm");
                cb(null);
            }
            catch (e) {
                cb(new Error(e));
            }
        });
    }
}

module.exports=Sandbox;