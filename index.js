const Spider = require('./spider');
const event = require('./lib').event;
const async = require('async');

module.exports = {
    spider: Spider,
    event: event
}
