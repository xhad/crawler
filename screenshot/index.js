const page = require('webpage').create();
const fork = require('child_process').fork;
const event = require('../lib').event;



module.exports = function(page) {
    fork(page.open(page.url, function() {
        page.render(`${page.url}.png`);
        phantom.exit();
    }));
}

