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

    this.setCashInWallet = function(dollars) {
        _dollars = dollars;
    }

    this.setPintsOfMilkRemaining=function(pints) {
        _pints = pints;
    }

    this.setCreditCard = function(valid) {
        _creditCard = "yes"===valid;
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
};
