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

    this.pushFixture = function()
    {
        fixtureStack.push(this.getFixture());
    }

    this.popFixture = function()
    {
        var $fixture = fixtureStack.pop();
        statementExecutor.setInstance(this.ACTOR_INSTANCE_NAME,$fixture);
    }

    this.getFixture = function()
    {
        return statementExecutor.instance(this.ACTOR_INSTANCE_NAME);
    }
}

module.exports.SlimHelperLibrary=SlimHelperLibrary;