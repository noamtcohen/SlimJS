## SlimJS
An Async Node.js SliM server for FitNesse

[![fitnesse](logo/fitnesse-logo-small.png)](http://www.fitnesse.org/) 

Visit [FitNesse](http://www.fitnesse.org/) and say hi to Uncle Bob!

```
cd fitnesse
java -jar fitnesse-standalone.jar -p 8080
```

[http://localhost:8080](http://localhost:8080)


To start the UDP logger (for debugging)
```
node src/udp-logger.js
```

work in progress...

--
use `cb(err,value)` to return values back to FitNesse

### Passing tests
#### Decision Table

|eg.Division                  |||
|---------|-----------|---------|
|numerator|denominator|quotient?|
|10       |2          |5        |
|12.6     |3          |4.2      |
|100      |4          |25       |

```javascript
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
```

|should I buy milk                                           ||||
|--------------|-----------|-----------------------|------------|
|cash in wallet|credit card|pints of milk remaining|go to store?|
|0             |no         |0                      |no          |
|10            |no         |0                      |yes         |
|0             |yes        |0                      |yes         |
|10            |yes        |0                      |yes         |
|0             |no         |1                      |no          |
|10            |no         |1                      |no          |
|0             |yes        |1                      |no          |
|10            |yes        |1                      |no          |

```javascript
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
```
--
#### Script Table


|script|Greeter|ctorArg|100                |
|------|-------|-------|-------------------|
|check |hello  |Hi     |Hello Hi! (ctorArg)|
|check |foo    |bar_100                   ||

```javascript
function Greeter(c,num){
    this.hello = function(msg,cb){
        cb(null,"Hello " + msg + "! (" + c  +")");
    }
    this.foo = function(cb){
        cb(null,"bar_" + num);
    }
}
```
