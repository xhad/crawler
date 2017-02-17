const EventEmitter = require('events');

module.exports = {
    event: new EventEmitter().setMaxListeners(100),
    log: function (output) {
        // let d = new Date();
        // let n = '[' + d.getMonth() + ' : '
        //             + d.getDay() + ' : '
        //             + d.getHours() + ' : '
        //             + d.getMinutes() + '] ';

        return console.log(`${output}`)
    }
}