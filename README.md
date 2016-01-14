## [SlimJS](https://github.com/noamtcohen/SlimJS/)

An Async Node.js SliM server for FitNesse

Visit [FitNesse](http://www.fitnesse.org/) and say hi to [Uncle Bob!](https://cleancoders.com)

If you want to use slimjs on an existing FitNesse server then:

```
npm install -g slimjs
```
Create a test page in FitNesse and add this to the top of the page:

```
!define TEST_SYSTEM {slim}
!define COMMAND_PATTERN {slimjs %p}
!path /Path/To/My/Fixtures

|import      |
|my-test-file|

|Hi          |
|echo|sayHi? |
|Bob |Hi! Bob|

```

```javascript
/*
Place this file in: /Path/To/My/Fixtures/my-test-file.js
*/
function Hi(){
    this.setEcho = function(str,cb){
        this.echo = str;
        cb(null,null);
    }

    this.sayHi = function(cb){
        cb(null,"Hi! " + this.echo);
    }
}
```
--
#### For contributors

Some examples of passing fixtures are below. I'm working to pass the [FitNesse test suite for slim](http://fitnesse.org/FitNesse.SuiteAcceptanceTests.SuiteSlimTests). 

- [ChainTest](http://fitnesse.org/FitNesse.SuiteAcceptanceTests.SuiteSlimTests.ChainTest) - pass
- [ChainWithInstanceTest](http://fitnesse.org/FitNesse.SuiteAcceptanceTests.SuiteSlimTests.ChainWithInstanceTest) - pass

You can run these test locally here (after you startup):
[http://localhost:8080/FitNesse.SuiteAcceptanceTests.SuiteSlimTests](http://localhost:8080/FitNesse.SuiteAcceptanceTests.SuiteSlimTests)


To start the environment:

```
npm install
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

### Passing Fixtures
#### Decision Tables


|  eg.Division                    ||| 
|-------------|-----------|---------|
|numerator    |denominator|quotient?|
|10           |2          |$result= |
|$result      |10         |0.5      |
|12.6         |3          |4.2      |
|100          |4          |25       |


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
#### Script Tables



|script|Greeter|ctorArg                    |100                |
|------|-------|---------------------------|-------------------|
|check |hello  |Hi                         |Hello Hi! (ctorArg)|
|check |foo    |bar_100                                       ||
|check |json   |{x:"a-string",y:true,z:123}|a-string(123)      |


```javascript
function Greeter(c,num){
    this.hello = function(msg,cb){
        cb(null,"Hello " + msg + "! (" + c  +")");
    }
    
    this.foo = function(cb){
        cb(null,"bar_" + num);
    }

    this.json= function(obj,cb){
        cb(null,obj.x + "(" +obj.z+ ")");
    }
}
```


|script|child_process    |||
|------|----|-------|------|
|check |exec|node -v|v5.4.0|

```javascript
// Thanks to Tomasz (@mrt123)
var exec = require('child_process').exec;

function child_process() {
    this.exec = function (cmd, cb) {
        exec(cmd, function (err, stdout, stderr) {
            cb(err, stdout.trim());
        });
    }
}
```
