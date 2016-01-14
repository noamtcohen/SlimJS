/**
 * Created by noam on 1/13/16.
 */
function SlimHelperLibrary()
{
    this.ACTOR_INSTANCE_NAME = 'scriptTableActor';
    var  statementExecutor;
    var  fixtureStack = [];
    this.setStatementExecutor = function(_statementExecutor)
    {
        statementExecutor = _statementExecutor;
    }

    this.getStatementExecutor = function()
    {
        return statementExecutor;
    }

    this.pushFixture = function(cb)
    {
        this.getFixture(function(err,fixture){
            fixtureStack.push(fixture);
            cb(null,null);
        })

    }

    this.popFixture = function(cb)
    {
        var $fixture = fixtureStack.pop();
        statementExecutor.setInstance(this.ACTOR_INSTANCE_NAME,$fixture);
        cb(null,null);
    }

    this.getFixture = function(cb)
    {
        cb(null,statementExecutor.instance(this.ACTOR_INSTANCE_NAME));
    }
}

module.exports.SlimHelperLibrary=SlimHelperLibrary;