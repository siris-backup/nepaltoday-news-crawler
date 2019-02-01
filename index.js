console.log('crawler init....');
var Crawler = require("crawler");
console.log('crawler init completed');

var newscollection =new Array();

 
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            //top lastest news article
            var article=$(".main-news").find("article");
            var objNewsItem=new Object();
            if (article!=undefined)
            {
                objNewsItem.Title=$(article).find("h1").text();
                objNewsItem.Link=$(article).find("div").find("figure").find("a").attr("href");
                objNewsItem.ImageSource=$(article).find("div").find("figure").find("img").attr("src");
                objNewsItem.IsHeadLine=true;
                newscollection.push(objNewsItem);
            }

            
            //top lastest block news artciles
            $(".main-news").find(".blocks").find("article").each((i,item)=>{
                objNewsItem=new Object();
                objNewsItem.Title=$(item).find("h3").text();
                objNewsItem.Link=$(item).find("div").find("figure").find("a").attr("href");
                objNewsItem.ImageSource=$(item).find("div").find("figure").find("img").attr("src");
                objNewsItem.IsHeadLine=false;
                newscollection.push(objNewsItem);
            })

            console.log(JSON.stringify(newscollection));
        }
        done();
    }
});
 
c.queue('https://kantipurdaily.com');
 
 /*
// Queue just one URL, with default callback
c.queue('http://www.amazon.com');
 
// Queue a list of URLs
c.queue(['http://www.google.com/','http://www.yahoo.com']);
 
// Queue URLs with custom callbacks & parameters
c.queue([{
    uri: 'http://parishackers.org/',
    jQuery: false,
 
    // The global callback won't be called
    callback: function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            console.log('Grabbed', res.body.length, 'bytes');
        }
        done();
    }
}]);
 
// Queue some HTML code directly without grabbing (mostly for tests)
c.queue([{
    html: '<p>This is a <strong>test</strong></p>'
}]);
*/