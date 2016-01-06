var exec = require('child_process').exec;

function child_process() {
    this.exec = function (cmd, cb) {
        exec(cmd, function (err, stdout, stderr) {
            cb(err, stdout.trim());
        });
    }
}