var exec = require('child_process').exec;

function child_process() {
    this.exec = function (cmd) {

        return {
            then:function(fulfill,reject){
                exec(cmd, function (err, stdout, stderr) {
                    if(err)
                        return reject(err);

                    fulfill(stdout.trim());
                });
            }
        }
    }
}


module.exports.child_process=child_process;