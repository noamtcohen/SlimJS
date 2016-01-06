/**
 * Created by noamc on 1/6/16.
 */

var vm = require('vm');

var sandbox = { require:require, __OBJ__:{}};
vm.createContext(sandbox);


var ret = vm.createScript('__OBJ__=require("fs");',
    'sandbox.vm').runInNewContext(sandbox);

console.log(sandbox.__OBJ__);