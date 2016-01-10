/**
 * Created by noam on 1/7/16.
 */
function SetUp(){

}

function PageDriver(){

}

function EchoFixture(){
    var _name;
    var _s;

    this.setName = function(name,cb){
        _name = name;
        cb(null,null);
    }
    this.nameContains = function(s,cb) {
        cb(null,_name.indexOf(s)!==-1);
    }

    this.echo = function(echo,cb){
        cb(null,echo);
    }

    this.echoInt = function(i,cb) {
        cb(null,i);
    }
}

function TestSlim() {
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
}
