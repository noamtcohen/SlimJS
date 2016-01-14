/**
 * Created by noam on 1/7/16.
 */


function TestSlim(constructorArg) {
    this.echoBoolean = function(b,cb){
        cb(null,b);
    }
    this.setString = function(s, cb){
        this._s = s;
        cb(null,null);
    }
    this.getStringArg = function (cb) {
        cb(null,this._s);
    }
    this.createTestSlimWithString = function(s,cb){
        var ret = new TestSlim();
        ret.setString(s,function(){});
        cb(null,ret);
    }
    this.toString = function(){
        return "TestSlim: " + (constructorArg||'0') + ', ' + (this._s||'');
    }
}


function TestQuery(n){
    this.query = function(cb) {
        var table = [];
        for (var i = 1; i <= n; i++) {
            table.push([['n',i],['2n',2*i]]);
        }
        cb(null,table);
    }
}