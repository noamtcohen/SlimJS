/**
 * Created by noam on 1/7/16.
 */
function SetUp(){

}

function PageDriver(){

}

function EchoFixture(){
    var _s;
    this.echo = function(echo,cb){
        cb(null,echo);
    }
    this.echoBoolean = function(b,cb){
        cb(null,b);
    }
    this.setString = function(s,cb){
        _s=s;
        cb(null,null);
    }
    this.getStringArg = function(cb){
        cb(null,_s);
    }
}