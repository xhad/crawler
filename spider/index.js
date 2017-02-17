const Crawler = require('../crawler');
const scrape = require('../scraper');
const event = require('../lib').event;
const async = require('async');

let urls = [];
let pages = [];
let tasks = [];
let errors = [];

let Spider = function (url, options) {


}

Spider.prototype.url = function (url) {
    let crawl = new Crawler(url);
    
    event.on('status', status => {
        console.log(status);
    })

    crawl.url(url);

    event.on('url', url => {
        urls.push(url);
        console.log(url);
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
        console.log(task);
    })


}

module.exports = Spider;