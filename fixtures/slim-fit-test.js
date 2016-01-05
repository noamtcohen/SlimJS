function Greeter(c,num){
    this.hello = function(msg,cb){
        cb(null,"Hello " + msg + "! (" + c  +")");
    }
    this.foo = function(cb){
        cb(null,"bar_" + num);
    }
}

function ShouldIBuyMilk() {
    var _dollars;
    var _pints;
    var _creditCard;

    this.setCashInWallet = function(dollars,cb) {
        _dollars = dollars;
        cb(null,null);
    }

    this.setPintsOfMilkRemaining=function(pints,cb) {
        _pints = pints;
        cb(null,null);
    }

    this.setCreditCard = function(valid,cb) {
        _creditCard = "yes"===valid;
        cb(null,null);
    }

    this.goToStore = function(cb) {
        var ret=(_pints == 0 && (_dollars > 2 || _creditCard)) ? "yes" : "no";
        cb(null,ret);
    }
}


var eg={
    Division:function(){
        var num;
        var denom;

        this.setNumerator = function(n,cb){
            num = n;
            cb(null,null);
        }
        this.setDenominator = function(n,cb){
            denom=n;
            cb(null,null);
        }
        this.quotient = function(cb){
            cb(null,num/denom);
        }
    }
};
