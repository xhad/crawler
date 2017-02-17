const JsCrawler = require('js-crawler');
const event = require('../lib').event;

var Crawler = function (url) {
    this.crawler = new JsCrawler()
        .configure({
            shouldCrawl: function (page) {
                return url.indexOf(page.match(url)) > -1;
            },
            maxRequestsPerSecond: 1,
            maxConcurrentRequests: 10,
            depth: 10
        })
};

Crawler.prototype.url = function (url) {

    if (!url.match('http'))
        event.emit('status', 'Please add protocol to url')
    console.log('CRAWLING ' + url);
    return new Promise((resolve, reject) => {
        function isLocal(page) {
            if (page.match(url))
                return true;
            else return false;
        }

        this.crawler.crawl({
            url: url,
            success: function (page) {
                if (isLocal(page.url)) {
                    event.emit('page', page);
                    event.emit('url', page.url);
                    event.emit('status', page.status)
                    event.emit('referer', page.referer);
                }
            },
            failure: function (error) {
                event.emit('failure', {
                     status: error.status,
                     url: error.url
                });
            },
            finished: function (crawledUrls) {
                event.emit('complete', crawledUrls);
                resolve();
            }
        })
    }).catch(err => {
        return {
            error: page.status,
            pages: page.url
        }
    })

}


module.exports = Crawler;