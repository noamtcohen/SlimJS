/**
 * Created by noam on 1/3/16.
 */

module.exports.make = function(name, args){
    return cons(name,args);
}

module.exports.load = function(js){
    eval.call(null,js);
}

function cons(name,args){
    var ctor = JSON.stringify(args);

    eval("var __TMP__=new " + name + "(" + ctor.substr(1,ctor.length-2) + ")");
    return __TMP__;
}