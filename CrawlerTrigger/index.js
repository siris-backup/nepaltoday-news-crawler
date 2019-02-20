module.exports = function () {
	const { newsDbService } = require('nepaltoday-db-service');

	console.log('crawler init....');
	var Crawler = require('crawler');
	console.log('crawler init completed');

	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

	let newsSources = [];

	/************************************************
	--It extracts the news from setopati.com
	************************************************/
	function parseSetopati (res) {
		var newscollection = [];

		var $ = res.$;
		// first breaking news extraction
		$('.breaking-news-item').each((index, item) => {
			var objNewsItem = {};
			objNewsItem.title = $(item).find('a>.main-title').text();
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('a').find('img').attr('src') === undefined ? '' : $(item).find('a').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = findSourceIdByLink('setopati.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();

			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		});

		// other breaking news extraction
		$('.more-breaking-news .extra-news-item .items').each((index, item) => {
			var objNewsItem = {};
			objNewsItem.title = $(item).find('a').attr('title');
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('figure').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = findSourceIdByLink('setopati.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();

			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		});

		newsDbService.saveArticles(newscollection);
	}

	/************************************************
	--It extracts the news from ratopati.com
	************************************************/
	function parseRatopati (res) {
		var newscollection = [];

		var $ = res.$;
		// breaking news extraction
		$('.brkn-title').each((index, item) => {
			if ($(item).text() !== '') {
				var objNewsItem = {};
				objNewsItem.title = $(item).text();
				objNewsItem.link = 'https://ratopati.com' + $(item).find('a').attr('href');
				objNewsItem.imageLink = $(item).parent().next().next().find('img').attr('src');
				objNewsItem.isHeadline = true;
				objNewsItem.source = findSourceIdByLink('ratopati.com')
				objNewsItem.createdDate = new Date();
				objNewsItem.modifiedDate = new Date();

				if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
					newscollection.push(objNewsItem);
				}
			}
		});

		newsDbService.saveArticles(newscollection);
	}

	/************************************************
	--It extracts the news from dainiknepal.com
	************************************************/
	function parseDainik (res) {
		var newscollection = [];

		var $ = res.$;
		// visesh (breaking) news extraction
		$('#visesh').each((index, item) => {
			var objNewsItem = {};
			objNewsItem.title = $(item).find('h1').text();
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('a').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = findSourceIdByLink('dainiknepal.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();

			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		});

		// top bar news extraction
		$('.top-bar_loop').each((index, item) => {
			var objNewsItem = {}
			objNewsItem.title = $(item).find('h2').text();
			objNewsItem.link = $(item).find('h2').find('a').attr('href');
			objNewsItem.imageLink = $(item).find('img').attr('src');
			objNewsItem.isHeadline = false;
			objNewsItem.source = findSourceIdByLink('dainiknepal.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();

			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		});

		newsDbService.saveArticles(newscollection)
	}

	/************************************************
	--It extracts the news from kantipurdaily.com
	************************************************/
	function parseKantipur (res) {
		var newscollection = []

		var $ = res.$;
		// $ is Cheerio by default
		// a lean implementation of core jQuery designed specifically for the server

		// top lastest news article
		var article = $('.main-news').find('article');
		var objNewsItem = {}
		if (article !== undefined) {
			objNewsItem.title = $(article).find('h1').text();
			objNewsItem.link = $(article).find('div').find('figure').find('a').attr('href');
			objNewsItem.imageLink = 'http:' + $(article).find('div').find('figure').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = findSourceIdByLink('kantipurdaily.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		}

		// top lastest block news artciles
		$('.main-news').find('.blocks').find('article').each((i, item) => {
			objNewsItem = {};
			objNewsItem.title = $(item).find('h3').text();
			objNewsItem.link = $(item).find('div').find('figure').find('a').attr('href');
			objNewsItem.imageLink = 'http:' + $(item).find('div').find('figure').find('img').attr('src');
			objNewsItem.isHeadline = false;
			objNewsItem.source = findSourceIdByLink('kantipurdaily.com');
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();

			if (!(objNewsItem.imageLink === '' || objNewsItem.imageLink === undefined)) {
				newscollection.push(objNewsItem);
			}
		});

		newsDbService.saveArticles(newscollection)
	}

	function findSourceIdByLink (link) {
		return newsSources.filter(s => s.link.includes(link))[0]._id;
	}

	/************************************************
	--Crawler initalization
	************************************************/
	var c = new Crawler({
		maxConnections: 10,
		// This will be called for each crawled page
		callback: function (error, res, done) {
			if (error) {
				console.log(error);
			} else {
				if (res.connection._host.includes('kantipurdaily.com')) {
					parseKantipur(res);
				} else if (res.connection._host.includes('dainiknepal.com')) {
					parseDainik(res);
				} else if (res.connection._host.includes('setopati.com')) {
					parseSetopati(res);
				} else if (res.connection._host.includes('ratopati.com')) {
					parseRatopati(res);
				}
			}
			done();
			console.log('crawler done scraping');
		}
	});

	/************************************************
	--Setting up the news sites for the crawler
	************************************************/
	newsDbService.getAllSources().then(sources => {
		newsSources = sources;

		sources.forEach(source => {
			console.log(source.link);
			c.queue(source.link);
		})
	})
};
