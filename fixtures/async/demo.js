const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

let result = 'initial value'

function AsyncDemo () {
    return {
        asyncCall () {
            return sleep().then(() => {
                result = 'changed';
                return true;
            })
        },
        result: () => result
    }
}

module.exports=  { AsyncDemo }
