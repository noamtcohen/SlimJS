
function Greeter(c,num){
    this.hello = function(msg){
        return "Hello " + msg + "! (" + c  +")";
    }
    this.foo = function(){
        return "bar_" + num;
    }

    this.json= function(obj){
        return obj.x + "(" +obj.z+ ")";
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

    this.goToStore = function() {
        var ret=(_pints == 0 && (_dollars > 2 || _creditCard)) ? "yes" : "no";
        return ret;
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
        this.quotient = function(){
            return num/denom;
        }
    }
};
