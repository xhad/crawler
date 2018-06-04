# crawler

Crawler for URLs, Sitemapping, information, and more.

```
git clone https://github.com/xhad/crawler
cd crawler
npm i
```


Edit the example.js file or create your own use case and add the URL of the website you want to Crawl.
```javascript
const Spider = require('./index').spider;

// let url = 'https://d376yh3jkryyz6.cloudfront.net';
let url = 'https://www.sentigence.com';
let spider = new Spider(url);
```
To start the crawl:
```
npm start
```

To add scripts to run on each URL, create a process fork and run it in the Spider after an 'url' event fires. 
When the crawl has finished, check out the results folder.

This project was created for running scripts against my own websites for testing security and should not be used
to copy or harm anyone's property.
