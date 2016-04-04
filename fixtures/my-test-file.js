/**
 * Created by noam on 1/13/16.
 */

require("./test-this-too");

function Hi(){
    this.setEcho = function(str){
        this.echo = str;
    }

    this.sayHi = function(){
        return "Hi! " + this.echo;
    }
}

module.exports.Hi = Hi;