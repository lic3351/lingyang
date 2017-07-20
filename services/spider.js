var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var options = {
    "url": 'http://www.xuancheng.org/forum-268-1.html',
    "Accept": 'text/html,application/xhtml+xml,application/xml;',
    "Accept-Encoding": 'gzip, deflate, br',
    "User - Agent": 'Mozilla/5.0(Windows NT 10.0; WOW64; rv:54.0)'
};

http.get(options.url, function(res) {
    var bufferHelper = new BufferHelper();
    res.on('data', function(chunk) {
        bufferHelper.concat(chunk);
    });
    res.on('error',function(e){
    	console.log(e);
    })
    res.on('end', function() {
        var $ = cheerio.load(iconv.decode(bufferHelper.toBuffer(), 'GBK'));
        var article_list = $("table#threadlisttableid tbody[id^='normalthread']").html();
        var pg_link = $('div.pg').html();
        console.log(article_list);
    });
})


// try {
//     request(options, function(error, response, body) {

//         if (!error && response.statusCode == 200) {
//             // var buf = iconv.encode(body, 'gbk');
//             // var str = iconv.decode(buf, 'utf-8');
//             $ = cheerio.load(body);
//             var ccc = $("table#threadlisttableid").html();
//             var cc = $('div.pg').html();
//             console.log(ccc);
//         }
//     })
// } catch (e) {
//     console.log(e);
// }