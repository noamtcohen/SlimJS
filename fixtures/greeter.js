function Greeter(c,num){
    this.hello = function(msg,cb){
        cb("Hello " + msg + "! (" + c  +")");
    }
    this.foo = function(cb){
        cb("bar_" + num);
    }
}