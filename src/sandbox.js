/**
 * Created by noam on 1/3/16.
 */

var vm = require('vm'),
    fs = require('fs'),
    LOG = require("./udp-logger").log;

module.exports.addWorkingDirectory = function(workingDirectory){
    module.paths.push(workingDirectory);
}


module.exports.make = function (name, args) {
    return sandbox.make(name, args);
}

module.exports.loadFile = function (path, cb) {
    fs.readFile(path,'utf8', function (err, js) {
        if (err)
            return cb(err);
        try {
            vm.runInContext(js, sandbox, path + ".vm");
            cb(null);
        }
        catch (e) {
            cb(new Error(e));
        }
    });
}

var sandbox = {
    require: require,
    process:process,
    LOG:LOG,

    make: function (name, args) {
        if (!args)
            args = [];

        try {
            var ns = name.split('.');

            var theType = this[ns[0]];
            for (var i = 1; i < ns.length; i++)
                theType = theType[ns[i]];

            return construct(theType, args);
        }
        catch (e) {
            return "Couldn't make '" + name + "'. (" + e + ")";
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

vm.createContext(sandbox);



