/**
 * Created by noam on 1/18/16.
 */

function ImportExecutor(state){
    this.import = function(instructionArgument,cb){
        var id = instructionArgument[0];
        var fileName = instructionArgument[2];

        state.loadFileIntoSandbox(fileName, function (err) {
            if (err)
                return cb([id, toException(err)]);

            cb([id, "OK"]);
        });
    }
}

module.exports = ImportExecutor;