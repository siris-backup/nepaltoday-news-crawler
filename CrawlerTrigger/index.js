module.exports = function () {

	const { newsDbService } = require('nepaltoday-db-service');

	// var dbService=new newsDbService();

	console.log('crawler init....');
	var Crawler = require('crawler');
	console.log('crawler init completed');

	// Global variable for news sites
	var newsSites = ['https://kantipurdaily.com', 'https://dainiknepal.com', 'https://ratopati.com', 'https://setopati.com'];

	/************************************************
	--It extracts the news from setopati.com
	************************************************/
	function parseSetopati (res) {
		var newscollection = new Array();

		var $ = res.$;
		// first breaking news extraction
		$('.breaking-news-item').each((index, item) => {
			var objNewsItem = new Object();
			objNewsItem.title = $(item).find('a>.main-title').text();
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('a').find('img').attr('src') == undefined ? '' : $(item).find('a').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = 'www.setopati.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
		});

		// other breaking news extraction
		$('.more-breaking-news .extra-news-item .items').each((index, item) => {
			var objNewsItem = new Object();
			objNewsItem.title = $(item).find('a').attr('title');
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('figure').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = 'www.setopati.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
		});
		console.log(JSON.stringify(newscollection));
	}

	/************************************************
	--It extracts the news from ratopati.com
	************************************************/
	function parseRatopati (res) {
		var newscollection = new Array();

		var $ = res.$;
		// breaking news extraction
		$('.brkn-title').each((index, item) => {
			if ($(item).text() != '') {
				var objNewsItem = new Object();
				objNewsItem.title = $(item).text();
				objNewsItem.link = 'https://ratiopati.com' + $(item).find('a').attr('href');
				objNewsItem.imageLink = $(item).parent().next().next().find('img').attr('src');
				objNewsItem.isHeadline = true;
				objNewsItem.source = 'www.ratiopati.com';
				objNewsItem.createdDate = new Date();
				objNewsItem.modifiedDate = new Date();
				newsDbService.saveArticle(objNewsItem);
			}
		});

		console.log(JSON.stringify(newscollection));
	}

	/************************************************
	--It extracts the news from dainiknepal.com
	************************************************/
	function parseDainik (res) {
		var newscollection = new Array();

		var $ = res.$;
		// visesh (breaking) news extraction
		$('#visesh').each((index, item) => {
			var objNewsItem = new Object();
			objNewsItem.title = $(item).find('h1').text();
			objNewsItem.link = $(item).find('a').attr('href');
			objNewsItem.imageLink = $(item).find('a').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = 'www.dainiknepal.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
		});

		// top bar news extraction
		$('.top-bar_loop').each((index, item) => {
			var objNewsItem = new Object();
			objNewsItem.title = $(item).find('h2').text();
			objNewsItem.link = $(item).find('h2').find('a').attr('href');
			objNewsItem.imageLink = $(item).find('img').attr('src');
			objNewsItem.isHeadline = false;
			objNewsItem.source = 'www.dainiknepal.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
		});

		console.log(JSON.stringify(newscollection));
	}

	/************************************************
	--It extracts the news from kantipurdaily.com
	************************************************/
	function parseKantipur (res) {
		var newscollection = new Array();

		var $ = res.$;
		// $ is Cheerio by default
		// a lean implementation of core jQuery designed specifically for the server

		// top lastest news article
		var article = $('.main-news').find('article');
		var objNewsItem = new Object();
		if (article != undefined) {
			objNewsItem.title = $(article).find('h1').text();
			objNewsItem.link = $(article).find('div').find('figure').find('a').attr('href');
			objNewsItem.imageLink = $(article).find('div').find('figure').find('img').attr('src');
			objNewsItem.isHeadline = true;
			objNewsItem.source = 'www.kantipurdaily.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
			// newscollection.push(objNewsItem);
		}


		// top lastest block news artciles
		$('.main-news').find('.blocks').find('article').each((i, item) => {
			objNewsItem = new Object();
			objNewsItem.title = $(item).find('h3').text();
			objNewsItem.link = $(item).find('div').find('figure').find('a').attr('href');
			objNewsItem.imageLink = $(item).find('div').find('figure').find('img').attr('src');
			objNewsItem.isHeadline = false;
			objNewsItem.source = 'www.kantipurdaily.com';
			objNewsItem.createdDate = new Date();
			objNewsItem.modifiedDate = new Date();
			newsDbService.saveArticle(objNewsItem);
		}
		);

		console.log(JSON.stringify(newscollection));
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
				}
				else if (res.connection._host.includes('dainiknepal.com')) {
					parseDainik(res);
				}
				else if (res.connection._host.includes('setopati.com')) {
					parseSetopati(res);
				}
				else if (res.connection._host.includes('ratopati.com')) {
					parseRatopati(res);
				}
			}
			done();
		}
	});

	/************************************************
	--Setting up the news sites for the crawler
	************************************************/
	newsSites.forEach(element => {
		console.log(element);
		c.queue(element);
	})

};
