/**
 * Created by noamc on 1/6/16.
 */

var JSON5 = require('json5');
var t = JSON5.parse('{x:"a-string",y:true,z:123}');
console.log(t);
var s=JSON5.stringify(t);

console.log(s);
