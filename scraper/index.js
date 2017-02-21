const lib = require('../lib');
const async = require('async');
const event = lib.event;

const patterns = {};  
patterns.protocol = /(http(s)?)/;  
patterns.domain = /^\d?(?:(?:[\+]?(?:[\d]{1,3}(?:[ ]+|[\-.])))?[(]?(?:[\d]{3})[\-/)]?(?:[ ]+)?)?(?:[a-zA-Z2-9][a-zA-Z0-9 \-.]{6,})(?:(?:[ ]+|[xX]|(i:ext[\.]?)){1,2}(?:[\d]{1,5}))?$/
patterns.email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/
patterns.path = /^.*[\/\\]/
patterns.fileName = /(.+)\.(.+)/
patterns.href = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/
patterns.scriptSrc = /(<script>)/

const regex = {
        email: { 
            type: 'emails',
            regex: new RegExp(patterns.email, 'gi')
        },
        domain: {
            type: 'domains',
            regex: new RegExp(patterns.domain, 'gi')
        },
        file: {
            type: 'files',
            regex:  new RegExp(patterns.fileName, 'gi')
        }, 
        href: {
            type: 'href', 
            regex: new RegExp(patterns.href, 'gi')
        }, 
        scriptSrc: {
            type: 'script-src', 
            regex: new RegExp(patterns.scriptSrc, 'gi')
        }
    };

module.exports = function(page) {
    return new Promise((resolve, reject) => {
        event.emit('task', 'SCRAPING >>> ' + page.url);

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
                            value: result
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
                search(page, regex.domain)
                callback();
            },
            // function(callback) {
            //     search(page, regex.scriptSrc)
            //     callback();
            // }        
        ]

        async.parallel(tasks, () => {
            event.emit('task', 'finished scraping ' + page.url);
        })


    }).catch(err => { throw err})
}


