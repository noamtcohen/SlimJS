/**
 * Created by noam on 4/21/16.
 */

function prmis(task){
    return{
        then:task
    }
}

var http = require('http');

function server(){
    this.httpServer;
}

server.prototype.self = function () {
    return this;
}

server.prototype.startServer = function () {
    return prmis((fulfil, reject) => {
        this.httpServer = http.createServer();
        fulfil(true);
    });
}

server.prototype.shutdown = function () {
    this.httpServer.close();
    return true;
}

function commander(){}
commander.prototype ={
    fire:function(cmd){
        return {
            then:function(fulfil,reject){
                fulfil("??? Hi! "+cmd+"???");
            }
        }
    }
}

function parser(){}

parser.prototype={
    parse:function(data){
        return{
            then:function(fulfil,reject){
                fulfil(data.substr(4,3));
            }
        }
    }
}

module.exports={
    server:server,
    commander:commander,
    parser:parser
}