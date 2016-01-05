/**
 * Created by noam on 1/3/16.
 */


(function (exports) {
    exports.make = function (name, args) {
        return cons(name, args);
    }

    exports.load = function (js) {
        try {
            eval.call(null, js);
            return null;
        } catch (e) {
            return e;
        }
    }

    function cons(name, args) {
        if (!args)
            args = [];

        try {
            var ctor = JSON.stringify(args);
            eval("var __OBJ__=new " + name + "(" + ctor.substr(1, ctor.length - 2) + ")");
            return __OBJ__;
        }
        catch (e) {
            return e.toString();
        }
    }

}(module.exports));

