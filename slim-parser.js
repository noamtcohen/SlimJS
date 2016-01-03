/**
 * Created by noamc on 1/3/16.
 */

module.exports.SlimParser = function(){

};

module.exports.SlimParser.prototype.parse= function(instruction){
    var json = slimToArray(instruction);

    return JSON.parse(json);
}

module.exports.SlimParser.prototype.stringify= function(arr){
    var arr = arrayToSlim(arr);

    var result =  pad(arr.length+3) +":[" + arr + ":]";
    return result;
}

function arrayToSlim(arr){

    var result = pad(arr.length) + ":"
    for(var i=0;i<arr.length;i++){

        var elm = arr[i]
        if(Array.isArray(elm))
        {
            var a = arrayToSlim(elm)
            result += pad(a.length+2) +":["+ a + "]";
        }
        else
        {
            result += pad(elm.length) + ":" + elm + ":";
        }
    }

    return result;
}

function slimToArray(slim){
    var result = "[";
    var numHeader = slim.substr(2,slim.indexOf(':')-2);
    var numberOfElementsInArray = parseInt(numHeader);
    slim = slim.substr(numHeader.length+3, slim.length-(numHeader.length+3)-2);

    var cur  =0
    for(var i=0;i<numberOfElementsInArray;i++)
    {
        var elmHeader = slim.substr(cur,slim.indexOf(':'));
        var elmLength = parseInt(elmHeader);
        var elm = slim.substr(cur+elmHeader.length+1,elmLength);

        if(elm[0]==='[')
            result += slimToArray(elm) + ",";
        else
            result += '"' + elm + "\",";

        cur += elmHeader.length + elm.length+2;
    }
    if(result[result.length-1]===',')
        result = result.substr(0,result.length-1);

    result +=']';
    return result;
}

function pad(num) {
    var s = num+"";
    while (s.length < 6) s = "0" + s;
    return s;
}
