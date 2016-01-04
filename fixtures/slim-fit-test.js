function Greeter(c,num){
    this.hello = function(msg,cb){
        cb(null,"Hello " + msg + "! (" + c  +")");
    }
    this.foo = function(cb){
        cb(null,"bar_" + num);
    }
}
function Division(){
    var num;
    var denom;

    this.setNumerator = function(n){
        num = n;
    }
    this.setDenominator = function(n){
        denom=n;
    }
    this.quotient = function(cb){
        cb(null,num/denom);
    }
}