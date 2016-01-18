/**
 * Created by noam on 1/5/16.
 */

var LOG = require("./../utils/LOG").LOG,
    helper = require("./../SlimHelperLibrary"),
    ImportExecutor = require('./ImportExecutor'),
    MakeExecutor = require('./MakeExecutor'),
    ExecutionState = require('./ExecutionState'),
    CallExecutor = require('./CallExecutor'),
    AssignExecutor = require('./AssignExecutor');


function StatementExecutor(fixFolder) {
    var state = new ExecutionState(fixFolder);

    var importer = new ImportExecutor(state);
    var maker = new MakeExecutor(state);
    var caller = new CallExecutor(state);
    var assigner = new AssignExecutor(state);

    addSlimHelperLibrary(this);

    this.import = importer.import;
    this.make = maker.make;
    this.call = caller.call;
    this.callAndAssign = caller.callAndAssign;
    this.assign = assigner.assign;

    this.setInstance = function(name,fixture){
        state.setInstance(name,fixture);
    }

    this.instance =function(name){
        return state.getInstance(name);
    }

    function addSlimHelperLibrary(executer)
    {
        var slimHelper = new helper.SlimHelperLibrary();
        slimHelper.setStatementExecutor(executer);

        state.pushToLibrary(slimHelper.ACTOR_INSTANCE_NAME,slimHelper);
    }
}

module.exports = StatementExecutor;