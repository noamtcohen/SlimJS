/**
 * Created by noam on 4/21/16.
 */


var http = require('http');

function server(){
    this.httpServer;
}

server.prototype={
    self:function(){
        return this;
    },

    startServer:function(){
        return{
            then:function(fulfil,reject){
                this.httpServer =http.createServer();
                fulfil(true);
            }
        }
    },

    shutdown:function(){
        this.httpServer.close();
        return true;
    }
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