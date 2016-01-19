/**
 * Created by noam on 1/19/16.
 */

function ExecUtils(){
    this.toException = function (e) {
        if(e.stack)
            return "__EXCEPTION__:"+e.stack.toString();

        return "__EXCEPTION__:message:<<" + e.toString() + ">>";
    }
}

module.exports = ExecUtils;