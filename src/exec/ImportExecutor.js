/**
 * Created by noam on 1/18/16.
 */

var ExecUtils = require('./ExecUtils'),
    utils = new ExecUtils();

function ImportExecutor(state){
    this.import = function(instructionArgument,cb){
        var id = instructionArgument[0];
        var fileName = instructionArgument[2];

        state.loadFileIntoSandbox(fileName, function (err) {
            if (err)
                return cb([id, utils.toException(err)]);

            cb([id, "OK"]);
        });
    }
}

module.exports = ImportExecutor;