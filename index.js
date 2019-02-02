console.log('crawler init....');
var Crawler = require("crawler");
console.log('crawler init completed');

var newsSites = ["https://kantipurdaily.com","https://dainiknepal.com","https://ratopati.com","https://setopati.com"];
 
function parseSetopati(res)
{
    var newscollection =new Array();

    var $ = res.$;
    //head lines
    $(".breaking-news-item").each((index,item)=>{
        var objNewsItem=new Object();    
        objNewsItem.Title=$(item).find("a>.main-title").text();
        objNewsItem.Link=$(item).find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("a").find("img").attr("src")==undefined?"":$(item).find("a").find("img").attr("src");
        objNewsItem.IsHeadLine=true;
        objNewsItem.Source="www.setopati.com";
        newscollection.push(objNewsItem);
    });

    $(".more-breaking-news .extra-news-item .items").each((index,item)=>{
        var objNewsItem=new Object();    
        objNewsItem.Title=$(item).find("a").attr("title");
        objNewsItem.Link=$(item).find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("figure").find("img").attr("src");
        objNewsItem.IsHeadLine=true;
        objNewsItem.Source="www.setopati.com";
        newscollection.push(objNewsItem);
    });
    console.log(JSON.stringify(newscollection));
}

function parseRatopati(res)
{
    var newscollection =new Array();

    var $ = res.$;
    //head lines
    $("#visesh").each((index,item)=>{
        var objNewsItem=new Object();    
        objNewsItem.Title=$(item).find("h1").text();
        objNewsItem.Link=$(item).find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("a").find("img").attr("src");
        objNewsItem.IsHeadLine=true;
        objNewsItem.Source="www.dainiknepal.com";
        newscollection.push(objNewsItem);
    });
}
function parseDainik(res)
{
    var newscollection =new Array();

    var $ = res.$;
    //head lines
    $("#visesh").each((index,item)=>{
        var objNewsItem=new Object();    
        objNewsItem.Title=$(item).find("h1").text();
        objNewsItem.Link=$(item).find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("a").find("img").attr("src");
        objNewsItem.IsHeadLine=true;
        objNewsItem.Source="www.dainiknepal.com";
        newscollection.push(objNewsItem);
    });

    //top bar
    $(".top-bar_loop").each((index,item)=>{
        var objNewsItem=new Object();    
        objNewsItem.Title=$(item).find("h2").text();
        objNewsItem.Link=$(item).find("h2").find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("img").attr("src");
        objNewsItem.IsHeadLine=false;
        objNewsItem.Source="www.dainiknepal.com";
        newscollection.push(objNewsItem);
    });
    
    console.log(JSON.stringify(newscollection));
}

function parseKantipur(res)
{
    var newscollection =new Array();

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
        objNewsItem.Source="www.kantipurdaily.com";
        newscollection.push(objNewsItem);
    }

    
    //top lastest block news artciles
    $(".main-news").find(".blocks").find("article").each((i,item)=>{
        objNewsItem=new Object();
        objNewsItem.Title=$(item).find("h3").text();
        objNewsItem.Link=$(item).find("div").find("figure").find("a").attr("href");
        objNewsItem.ImageSource=$(item).find("div").find("figure").find("img").attr("src");
        objNewsItem.IsHeadLine=false;
        objNewsItem.Source="www.kantipurdaily.com";
        newscollection.push(objNewsItem);
        }
     );

     console.log(JSON.stringify(newscollection));
}

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else
        {
            if(res.connection._host.includes("kantipurdaily.com"))
            {
                parseKantipur(res);
            }
            else if(res.connection._host.includes("dainiknepal.com"))
            {
                parseDainik(res);
            }
            else if(res.connection._host.includes("setopati.com"))
            {
                parseSetopati(res);
            }  
            else if(res.connection._host.includes("ratopati.com"))
            {
               // parseRatopati(res);
            }                        
        }
        done();
    }
});
 
//scraping the news sites
newsSites.forEach(element=>{
    console.log(element);
    c.queue(element);
})

 

