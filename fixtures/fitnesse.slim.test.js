/**
 * Created by noam on 1/7/16.
 */


function TestSlim(constructorArg) {
    this.echoBoolean = function(b){
       return b;
    }
    this.setString = function(s){
        this._s = s;
    }
    this.getStringArg = function () {
        return this._s;
    }
    this.createTestSlimWithString = function(s){
        var ret = new TestSlim();
        ret.setString(s,function(){});
        return ret;
    }
    this.toString = function(){
        return "TestSlim: " + (constructorArg||'0') + ', ' + (this._s||'');
    }
}


function TestQuery(n){
    this.query = function() {
        var table = [];
        for (var i = 1; i <= n; i++) {
            table.push([['n',i],['2n',2*i]]);
        }
        return table;
    }
}

module.exports={
    TestSlim:TestSlim,
    TestQuery:TestQuery
}