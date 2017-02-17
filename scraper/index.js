const lib = require('../lib');
const async = require('async');
const event = lib.event;

const regex = {
        email: { 
            type: 'email',
            regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
        },
        phone: {
            type: 'phone number',
            regex: /^\d?(?:(?:[\+]?(?:[\d]{1,3}(?:[ ]+|[\-.])))?[(]?(?:[\d]{3})[\-/)]?(?:[ ]+)?)?(?:[a-zA-Z2-9][a-zA-Z0-9 \-.]{6,})(?:(?:[ ]+|[xX]|(i:ext[\.]?)){1,2}(?:[\d]{1,5}))?$/gm
        }
    };

module.exports = function(page) {
return new Promise((resolve, reject) => {
    event.emit('task', 'SCRAPING >>> ' + page.url);
    let results = [];

    function escapeRegExp(str, callback) {
        str.replace(/\s/g,'')
        re = new RegExp(String.fromCharCode(160), "g");
        str.replace(re, " ")
        callback(str);
    }    

    function reggie (string, pattern, callback) {
        let matches = [];
        matches.push(string.match(pattern.regex));
        if (matches[0] != null) callback(matches);
    }

    function search(page, pattern, callback) {
        event.emit('task', 'SCRAPING FOR >>> ' + pattern.type)
        escapeRegExp(page.content, (string) => {
            reggie(string, pattern, (result) => {
                if (result) 
                    event.emit('match', 
                    {
                        page: page.url, 
                        type: pattern.type,
                        found: result[0].length,
                        value: result[0]
                    })
            }) 
        });         
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


