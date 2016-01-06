/**
 * Created by noam on 1/3/16.
 */


(function (exports) {
    var vm = require('vm');
    var util = require('util');
    var fs = require("fs");

    var sandbox = { require:require, made:{}};
    vm.createContext(sandbox);

    exports.make = function (name, args) {
        return cons(name, args);
    }

    var _script ="";
    exports.load = function (js) {
        _script += ";"+js;
    }

    exports.loadFile = function (path,cb) {
        fs.readFile(path, function (err, jsfile) {
            if(!err)
                exports.load(jsfile.toString());
            cb(err);
        });
    }

    function cons(name, args) {
        if (!args)
            args = [];

        try {

            var ctor = JSON.stringify(args);
            var js = _script + "; made=new " + name + "(" + ctor.substr(1, ctor.length - 2) + ");";

            vm.runInContext(js,sandbox);

            if(!sandbox.made)
                return "Could not make: " + name;

            return sandbox.made;

        }
        catch (e) {
            return e.toString();
        }
    }

}(module.exports));

