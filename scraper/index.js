const lib = require('../lib');
const async = require('async');
const event = lib.event;

const regex = {
        email: { 
            type: 'email',
            regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        phone: {
            type: 'phone number',
            regex: /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/
        }
    };

module.exports = function(page) {
return new Promise((resolve, reject) => {
    console.log('SCRAPING', page.url);
    let results = [];

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&").replace(/\s/g,'')
    }    

    function reggie (string, pattern, callback) {
        // string = 'test@test.com'
        let match = string.match(pattern.regex);
        console.log(match);
        callback(match);
    }

    function search(page, pattern, callback) {
        event.emit('task', 'Seaching for ' + pattern.type + ' in ' + page.url)
        let string = escapeRegExp(page.content);
        reggie(string, pattern, (result) => {
            if (result) event.emit('match', 
                {
                    page: page.url, 
                    type: pattern.type,
                    value: result[0]
                })
            else console.log(null);
        })          
    }





    const tasks = [
        function(callback) {
            search(page, regex.email)
            callback();

        },
        function(callback) {
            search(page, regex.phone)
            callback();
        }        
    ]

    async.series(tasks, () => {
        console.log('finished scraping ' + page.url);
    })


}).catch(err => { throw err})
}


