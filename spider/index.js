const Crawler = require('../crawler');
const scrape = require('../scraper');
const lib = require('../lib');
const async = require('async');

const event = lib.event;
const log = lib.log;

let urls = [];
let pages = [];
let tasks = [];
let errors = [];

let Spider = function (url, options) { 
    
    let crawl = new Crawler(url);
    
    event.on('status', status => {
        console.log(status);
    })

    crawl.url(url);

    event.on('url', url => {
        urls.push(url);
    })

    // when a new page is found
    event.on('page', page => {
        pages.push(page)
        scrape(page)
    })

    // if href is a javascript method or other errors
    event.on('failure', res => {
        errors.push(res);
    })

    // if scraper finds a string pattern emit a match event
    event.on('match', obj => {
        console.log(obj);
    })

    event.on('task', task => {
        log(task);
    })
}

module.exports = Spider;