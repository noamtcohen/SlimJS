## SlimJS

An Async Node.js SliM server for FitNesse

To use slimjs on an existing FitNesse server:
```
npm install -g slimjs
```
If you want to most recent version please use the github repo since npm is not allways up-to-date.


On **windows** there might be an error when java is trying to execute `SlimJS` even though installed globally. Try to replace `COMMAND_PATTERN ` with an absolute path.

```
!define COMMAND_PATTERN {node C:\Users\<MY_USER>\AppData\Roaming\npm\node_modules\slimjs\src\SlimJS %p}
```

Create a test page in FitNesse and add this to the top of the page, remember on windows to replace `COMMAND_PATTERN` with an absolute path if needed:

```
!define TEST_SYSTEM {slim}
!define COMMAND_PATTERN {SlimJS %p}
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

    this.sayHi = function(){
        return "Hi! " + this.echo;
    }
}

module.exports.Hi = Hi;
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

module.exports.child_process=child_process;
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

module.exports.eg=eg;
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

module.exports.ShouldIBuyMilk=ShouldIBuyMilk;
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

module.exports.Json=Json;
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
node src/utils/LogUdpServer.js
```


### Thanks to:
[Tomasz](https://github.com/mrt123) @mrt123. The first user of slimjs and for the async exec example.<br/>
[Gregor Gramlich](https://github.com/ggramlich) @ggramlich. For help with the SliM protocol, the [PHP](https://github.com/ggramlich/phpslim) implementation and the promise proposal.<br/>
[Christian Gagneraud](https://github.com/chgans) @chgans. [QtSlim](https://github.com/chgans/QtSlim)<br/>

Libraries:<br/>
[json5](https://github.com/aseemk/json5)<br/>
