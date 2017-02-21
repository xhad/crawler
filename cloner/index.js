const parseUrl = require('parse-url');
const wget = require('website-scraper');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const del = require('del');
const event = require('../lib').event;
const replace = require('replace');

const appDir = path.dirname(require.main.filename);

let Cloner = function (url) {

    let baseUrl = url;
    let domain = url.replace(/.*?:\/\//g, "");
    let localDomain = 'localhost:8080';
    localDomain.replace('.', '\.');

    del([`${appDir}/results/sites/${domain}`]).then(() => {


        event.emit('task', `CLONING >>> ${url}`); 

        let options = {
                        urls: [url],
                        urlFilter: function(url){
                            return url.indexOf(baseUrl) === 0;
                        },
                        recursive: true,
                        maxDepth: 100,
                        prettifyUrls: true,
                        filenameGenerator: 'bySiteStructure',
                        directory: `${appDir}/results/sites/${domain}`
                    };
                           
        event.emit('task', 'CLONING SITE...');
        wget(options).then(result => {
            event.emit('task', result);

            replace({
                regex: domain,
                replacement: localDomain,
                paths: [`${appDir}/results/sites/${domain}/`],
                recursive: true,
                silent: false,
            });

        });


    });



}

module.exports = Cloner;



    
