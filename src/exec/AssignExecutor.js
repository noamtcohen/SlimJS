/**
 * Created by noam on 1/18/16.
 */

function AssignExecutor(state){
    this.assign = function (instructionArguments, cb) {
        var id = instructionArguments[0];
        var symbol = instructionArguments[2];
        var val = instructionArguments[3];
        state.setSymbol(symbol,val);

        cb([id, "OK"]);
    }
}

module.exports = AssignExecutor;