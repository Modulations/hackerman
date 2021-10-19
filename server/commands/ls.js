module.exports = function (inp, callback) {
    callback(null, inp + ' PID ' + process.pid)
}