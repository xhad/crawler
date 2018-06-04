const JsCrawler = require('js-crawler');
const event = require('../lib').event;

module.exports = function (url) {
    this.crawler = new JsCrawler()
        .configure({

            shouldCrawl: function (page) {
                return url.indexOf(page.match(url)) > -1;
            },
            maxRequestsPerSecond: 2,
            maxConcurrentRequests: 10,
            depth: 10
        })

    if (!url.match('http')) {
        event.emit('status', 'Please add protocol to url')
        return;
    }

    event.emit('task', 'CRAWLING ' + url);

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
                } else {
                    event.emit('remote-url', page);
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