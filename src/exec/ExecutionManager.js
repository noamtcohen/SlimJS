/**
 * Created by noam on 1/18/16.
 */

var TestCodeLoader = require("./../TestCodeLoader");

function ExecutionManager(arrayOfSearchPaths){
    var instances = {};
    var library = [];
    var symbols  = {};

    var testCodeLoader = new TestCodeLoader(arrayOfSearchPaths);

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

    this.makeInstance = testCodeLoader.make;

    this.loadFileIntoSandbox = function(filename,cb){
        testCodeLoader.loadFile(filename,cb);
    }

    this.getLibraryObject = function(instanceName,funName){
        for (var i = library.length - 1; i >= 0; i--)
            if (library[i].name === instanceName && library[i].value[funName])
                return library[i].value;

        return null;
    }

    this.loadSymbolValuesToArguments = function(args){
        for (var i = 0; i < args.length; i++)
            if (args[i].toString().indexOf('$') === 0)
                args[i] = this.getSymbol(args[i].substr(1));
    }

    function hasSutFunction(instance){
        if(!instance)
            return false;

        return instance.sut && typeof instance.sut === 'function';
    }
}


module.exports =ExecutionManager;