/**
 * Created by noamc on 1/3/16.
 */

var JSON5 = require('json5'),
    LOG = require("./../utils/LOG").LOG;

function SlimParser() {
    this.parse = function (slimString) {
        var json = convertSlimStringToJson(slimString);

        return JSON.parse(json);
    }

    this.stringify = function (arr) {
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
                elm = elm.toString();
                result += pad(elm.length) + ":" + elm + ":";
            }
        }

        return result;
    }

    function convertSlimStringToJson(slimString) {
        var result = "[";
        var numHeader = slimString.substr(2, slimString.indexOf(':') - 2);
        var numberOfElementsInArray = parseInt(numHeader);
        slimString = slimString.substr(numHeader.length + 3, slimString.length - (numHeader.length + 3) - 2);

        var cur = 0
        for (var i = 0; i < numberOfElementsInArray; i++) {
            var elmHeader = slimString.substr(cur, slimString.indexOf(':'));
            var elmLength = parseInt(elmHeader);
            var elm = slimString.substr(cur + elmHeader.length + 1, elmLength);

            if (elm[0] === '[')
                result += convertSlimStringToJson(elm) + ",";
            else
                result += '' + inferValueType(elm) + ',';

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

    function inferValueType(val) {
        if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false')
            return val.toLowerCase();

        if (isNumber(val))
            return parseFloat(val);

        if (val.trim().indexOf('{') === 0) {
            try {
                var o = JSON5.parse(val);
                return JSON.stringify(o);
            } catch (e) {
            }
        }

        return '"' + val.replace(/"/g, '\\"') + '"'
    }

    function isNumber(str){
        return !isNaN(str);
    }
}


module.exports = SlimParser;