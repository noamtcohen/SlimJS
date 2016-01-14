/**
 * Created by noamc on 1/14/16.
 */
var Aoo = (function () {
    function Aoo() {
    }
    Aoo.prototype.do = function () {
        return "Hi!";
    };
    return Aoo;
})();
exports.Aoo = Aoo;
var Boo = (function () {
    function Boo() {
    }
    Boo.prototype.that = function () {
        return 1;
    };
    return Boo;
})();
exports.Boo = Boo;
