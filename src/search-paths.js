/**
 * Created by noam on 1/3/16.
 */

var vm = require('vm'),
    fs = require('fs');

module.exports.make = function (name, args) {
    return sandbox.make(name, args);
}

module.exports.loadFile = function (path, cb) {
    fs.readFile(path, function (err, js) {
        if (!err)
            vm.runInContext(js.toString(), sandbox);

        cb(err);
    });
}

var sandbox = {
    require: require,
    make: function (name, args) {
        if (!args)
            args = [];

        var ns = name.split('.');

        var theType =this[ns[0]];
        for(var i=1;i<ns.length;i++)
            theType = theType[ns[i]];

        try {
            return construct(theType, args);
        }
        catch (e) {
            return e.toString();
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



