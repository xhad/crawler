const Crawler = require('../crawler');
const Cloner = require('../cloner');
const fs = require('fs'); 
const scraper = require('../scraper');
const lib = require('../lib');

const event = lib.event;
const log = lib.log;

let urls = [];
let remoteUrls = [];
let loot = [];
let pages = [];
let tasks = [];
let errors = [];
let results = [
    {
        urls: urls, 
        remoteUrls: remoteUrls, 
        loot: loot
    }];

let Spider = function (url, options) { 
    
    let crawl = new Crawler(url);
    let clone = new Cloner(url);

    event.on('status', status => {
        console.log(status);
    })

    event.on('url', url => {
        urls.push(url);
    })

    event.on('remote-url', (page) => {
        remoteUrls.push([page.referer, page.url]);
    })

    // when a new page is found
    event.on('page', page => {
        pages.push(page)
        urls.push(page.url);
        scraper(page)
    })

    // emit errors from app
    event.on('error', err => {
        errors.push(err);
        log(err);
    })

    // if href is a javascript method or other errors
    event.on('failure', res => {
        errors.push(res);
    })

    // if scraper finds a string pattern emit a match event
    event.on('match', obj => {
        log(`FOUND ${obj.type} >>> ${obj.value}`);
        loot.push(obj);
    })

    event.on('task', task => {
        log(task);
    })

    event.on('complete', data => {
        const file = fs.createWriteStream(`./results/${url}.txt`);
        file.on('error', function(err) { /* error handling */ });
        results.forEach(function(v) { file.write(v + '\n'); });
        file.end();   
    })
}

module.exports = Spider;