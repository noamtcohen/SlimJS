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
    this.echoBoolean = function(b,cb){
        cb(null,b);
    }
    this.echoInt = function(i,cb) {
        cb(null,i);
    }
}