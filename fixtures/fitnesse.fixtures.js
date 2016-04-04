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

    this.setName = function(name){
        _name = name;
    }
    this.nameContains = function(s) {
        return _name.indexOf(s)!==-1;
    }

    this.echo = function(echo){
        return echo;
    }

    this.echoInt = function(i) {
        return i;
    }
}


module.exports={
    EchoFixture:EchoFixture
}