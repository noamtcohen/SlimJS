## SlimJS

An Async Node.js SliM server for FitNesse

Visit [FitNesse](http://www.fitnesse.org/) and say hi to [Uncle Bob!](https://cleancoders.com)

To use slimjs on an existing FitNesse server:

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

|Hi            |
|echo |sayHi?  |
|Bob  |Hi! Bob |

```

/Path/To/My/Fixtures/my-test-file.js

```javascript
function Hi(){
    this.setEcho = function(str){
        this.echo = str;
    }

    this.sayHi = function(cb){
        return "Hi! " + this.echo;
    }
}
```

If you want to do something asynchronous, return a `thenable` (promise): 

```
|script  |child_process            |
|check   |exec  |node -v  |v5.4.0  |
```

```javascript
var exec = require('child_process').exec;

function child_process() {
    this.exec = function (cmd) {

        return {
            then:function(fulfill,reject){
                exec(cmd, function (err, stdout, stderr) {
                    if(err)
                        return reject(err);

                    fulfill(stdout.trim());
                });
            }
        }
    }
}
```

Using namespaces:

```
|eg.Division                       |
|numerator |denominator |quotient? |
|10        |2           |$result=  |
|$result   |10          |0.5       |
|12.6      |3           |4.2       |
|100       |4           |25        |
```

```javascript
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
```

Name conversion:

```
|should I buy milk                                              |
|cash in wallet|credit card|pints of milk remaining|go to store?|
|0             |no         |0                      |no          |
|10            |no         |0                      |yes         |
|0             |yes        |0                      |yes         |
|10            |yes        |0                      |yes         |
|0             |no         |1                      |no          |
|10            |no         |1                      |no          |
|0             |yes        |1                      |no          |
|10            |yes        |1                      |no          |
```

```javascript
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
```

Using JSON

```
|Json                         |
|json               |X and Y ?|
|{x:1,y:2}          |3        |
|{x:'Bar', y:' Baz'}|Bar Baz  |
```

```javascript
function Json(){
    this.setJson = function(jsonObject){
        this.obj = jsonObject;
    }

    this.XAndY = function(){
        return this.obj.x + this.obj.y;
    }
}

```

--
#### For contributors

I'm working to pass the [FitNesse Test Suite for Slim](http://fitnesse.org/FitNesse.SuiteAcceptanceTests.SuiteSlimTests). 

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


### Thanks to:
[Tomasz](https://github.com/mrt123) @mrt123. The first user of slimjs and for the async exec example.<br/>
[Gregor Gramlich](https://github.com/ggramlich) @ggramlich. For help with the SliM protocol, the [PHP](https://github.com/ggramlich/phpslim) implementation and the promise proposal.<br/>
[Christian Gagneraud](https://github.com/chgans) @chgans. With [QtSlim](https://github.com/chgans/QtSlim)


<br/>
#### Libraries:
[json5](https://github.com/aseemk/json5)



