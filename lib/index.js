const EventEmitter = require('events');

module.exports = {
    event: new EventEmitter().setMaxListeners(100)
}