/**
 * Created by noam on 1/3/16.
 */

var fs = require('fs'),
    path = require('path');

var theRequireArrayOfTheTestFixtures=[];

function TestCodeLoader(arrayOfSearchPaths){
    this.loadFile = function (name, cb) {
        for(var i=0;i<arrayOfSearchPaths.length;i++){
            var tsxPath=path.resolve(path.join(arrayOfSearchPaths[i],name +'.tsx'));
            if(fileExists(tsxPath)){
                return loadFixture(tsxPath,cb);
            }
            var tsPath=path.resolve(path.join(arrayOfSearchPaths[i],name +'.ts'));
            if(fileExists(tsPath)){
                return loadFixture(tsPath,cb);
            }
            var jsPath=path.resolve(path.join(arrayOfSearchPaths[i],name +'.js'));
            if(fileExists(jsPath)){
                return loadFixture(jsPath,cb);
            }
        }

        cb("File not found: " + name);
    }

    function fileExists(file){
        try {
            fs.accessSync(file, fs.F_OK);
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadFixture(file,cb){
        try {
            theRequireArrayOfTheTestFixtures.push(require(file));
            cb(null);
        }
        catch (e) {
            cb(new Error(e));
        }
    }
}

TestCodeLoader.prototype.make = function(name, args, cb) {
    if (!args)
        args = [];

    try {
        var ns = name.split('.');

        var theType;

        for(var v=0;v<theRequireArrayOfTheTestFixtures.length;v++)
        {
            theType = theRequireArrayOfTheTestFixtures[v][ns[0]];

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

module.exports=TestCodeLoader;