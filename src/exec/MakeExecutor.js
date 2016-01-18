/**
 * Created by noam on 1/18/16.
 */

function MakeExecutor(state){
    this.make = function (instructionArgument, cb) {
        var id = instructionArgument[0];
        var instance = instructionArgument[2];
        var clazz = instructionArgument[3];

        if(classIsSingleSymbol(clazz)){
            var symbol = state.getSymbol(clazz.substr(1));
            if(typeof symbol !== 'string')
            {
                state.setInstance(instance,symbol);
                return cb([id,'OK'])
            }
        }

        clazz= replaceAllSymbols(clazz);

        var args = instructionArgument.slice(4);

        var obj = state.makeInstance(clazz, args);

        if (typeof obj === 'string')
            return cb([id, toException(obj)]);

        if (isLibraryObject(instance))
            state.pushToLibrary(instance,obj);
        else
            state.setInstance(instance,obj);

        cb([id, 'OK']);
    }

    function isLibraryObject(name){
        return name.indexOf('library') === 0;
    }

    function classIsSingleSymbol(clazz){
        return clazz.indexOf('$')===0 && clazz.match(/$/g).length==1;
    }

    function replaceAllSymbols(clazz){
        if(!needToReplaceSymbols(clazz))
            return clazz;

        var symbolKeys = state.getAllSymbolKeys()
        for(var i=0;i<symbolKeys.length;i++)
        {
            var key = symbolKeys[i];

            var symbol = state.getSymbol(key);

            if (typeof symbol === 'string'){
                var regex = new RegExp("\\$" + key,'g');
                clazz = clazz.replace(regex,symbol);
            }
        }

        return clazz;
    }

    function needToReplaceSymbols(clazz){
        return clazz.indexOf('$')!==-1;
    }
}

module.exports = MakeExecutor;