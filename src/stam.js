/**
 * Created by noamc on 1/6/16.
 */

var searchPaths = require('./search-paths');

searchPaths.loadFile("./fixtures/slim-fit-test.js",function(err){
    if(err)
        throw err;

    searchPaths.loadFile("./fixtures/test-this-too.js",function(err){
       if(err)
            throw err;

        var g = searchPaths.make("eg.Division");
        console.log(g);

        var tt = searchPaths.make("thisToo");
        tt.goo(function(err,val){
            console.log(val);
        })
    });
});