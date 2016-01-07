/**
 * Created by noamc on 1/3/16.
 */

var JSON5 = require('json5'),
    LOG = require("./udp-logger").log;

module.exports.SlimParser = SlimParser;

function SlimParser() {};

SlimParser.prototype.parse = function (instruction) {
    var json = slimToArray(instruction);

    LOG(">> " +json);
    return JSON.parse(json);
}

SlimParser.prototype.stringify = function (arr) {
    var arr = arrayToSlim(arr);

    var result = pad(arr.length + 2) + ":[" + arr + "]";
    return result;
}

function arrayToSlim(arr) {
    var result = pad(arr.length) + ":"
    for (var i = 0; i < arr.length; i++) {

        var elm = arr[i]
        if (Array.isArray(elm)) {
            var a = arrayToSlim(elm)
            result += pad(a.length + 2) + ":[" + a + "]:";
        }
        else {
            result += pad(elm.length) + ":" + elm + ":";
        }
    }

    return result;
}

function slimToArray(slim) {
    var result = "[";
    var numHeader = slim.substr(2, slim.indexOf(':') - 2);
    var numberOfElementsInArray = parseInt(numHeader);
    slim = slim.substr(numHeader.length + 3, slim.length - (numHeader.length + 3) - 2);

    var cur = 0
    for (var i = 0; i < numberOfElementsInArray; i++) {
        var elmHeader = slim.substr(cur, slim.indexOf(':'));
        var elmLength = parseInt(elmHeader);
        var elm = slim.substr(cur + elmHeader.length + 1, elmLength);

        if (elm[0] === '[')
            result += slimToArray(elm) + ",";
        else
            result += '' + infer(elm) + ',';

        cur += elmHeader.length + elm.length + 2;
    }
    if (result[result.length - 1] === ',')
        result = result.substr(0, result.length - 1);

    result += ']';
    return result;
}

function pad(num) {
    var s = num + "";
    while (s.length < 6) s = "0" + s;
    return s;
}

function infer(val) {
    if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false')
        return val.toLowerCase();

    var num = parseFloat(val);
    if (!isNaN(num))
        return num;

    if (val.trim().indexOf('{') === 0) {
        try {
            var o = JSON5.parse(val);
            return JSON.stringify(o);
        } catch (e) {
        }
    }

    return '"' + val.replace(/"/g, '\\"') + '"'
}
