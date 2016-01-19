/**
 * Created by noam on 1/18/16.
 */

var Sandbox = require("./../Sandbox"),
    path = require('path');

function ExecutionState(arrayOfSearchPaths){
    var instances = {};
    var library = [];
    var symbols  = {};

    var sandbox = new Sandbox(arrayOfSearchPaths);

    this.setInstance = function(name,fixture){
        instances[name]=fixture;
    }

    this.pushToLibrary = function(name,instance){
        library.push({name:name,value:instance});
    }

    this.getInstance = function(name){
        return instances[name]||null;
    }

    this.setSymbol = function(name,value){
        symbols[name] = value;
    }

    this.getSymbol = function(name){
        return symbols[name]||null;
    }

    this.getSut = function(instanceName){
        var instance =this.getInstance(instanceName);

        if (hasSutFunction(instance))
            return instance.sut();

        return null;
    }

    this.getAllSymbolKeys = function(){
        return Object.keys(symbols);
    }

    this.makeInstance = sandbox.make;

    this.loadFileIntoSandbox = function(filename,cb){
        //var jsPath = path.join(fixFolder, filename + ".js");
        sandbox.loadFile(filename,cb);
    }

    this.getLibraryObject = function(instanceName,funName){
        for (var i = library.length - 1; i >= 0; i--)
            if (library[i].name === instanceName && library[i].value[funName])
                return library[i].value;

        return null;
    }

    function hasSutFunction(instance){
        if(!instance)
            return false;

        return instance.sut && typeof instance.sut === 'function';
    }
}


module.exports =ExecutionState;