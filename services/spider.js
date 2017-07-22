var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var fs = require('fs');
var OutAModel = require('../model/schema').OutAModel;
var options = {
    "url": 'http://www.xuancheng.org/forum-268-1.html'
};
var ONEDAY = 1000 * 60 * 60 * 24;

//获取论坛总共有多少页帖子
var getTotal = function(url) {
    var p = new Promise(function(resolve, reject) {
        http.get(url, function(res) {
            var bufferHelper = new BufferHelper();
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('error', function(e) {
                console.log(e)
                reject(e);
            });
            res.on('end', function() {
                var str = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                var $ = cheerio.load(str);
                var str = $('div.pg a[class=last]').eq(0).text();
                var total = str.substring(str.search(/\d+/));
                console.log(total)
                resolve(total);
            });
        });
    });
    return p;
};

//获取每一页帖子列表大概信息
var getPre = function(url) {
    var p = new Promise(function(resolve, reject) {
        http.get(url, function(res) {
            var bufferHelper = new BufferHelper();
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('error', function(e) {
                reject(error);
                console.log(e);

            });
            res.on('end', function() {
                var str = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                var $ = cheerio.load(str);
                var article_list = [];
                $("table#threadlisttableid")
                    .find('tbody[id^=normalthread] tr').each(function(i, elem) {
                        article_list[i] = {
                            title: $(this).find('th a.xst').eq(0).text(),
                            href: $(this).find('th a.xst').eq(0).attr('href'),
                            author: $(this).find('td[class=by]').eq(0).find('a').eq(0).text(),
                            date: $(this).find('td[class=by]').children().eq(1).text(),
                            comments: $(this).find('td[class=num] a').eq(0).text(),
                            views: $(this).find('td[class=num] em').eq(0).text()
                        };
                    });
                console.log(article_list.slice(0, 3));
                resolve(article_list);
            });
        })
    })
    return p;
}

// getPre(options.url);

// var requestTimer = setTimeout(function() {
//     req.abort();
//     debug('......Request Timeout......');
// }, 5000);


var getContent = function(url) {
    var p = new Promise(function(resolve, reject) {
        http.get(url, function(res) {
            // clearTimeout(requestTimer);
            //下面是请求接口数据，得不到回应时，我们关闭等待返回数据的状态，因为有5秒的定时器，
            //5秒内如果收到了完整的数据，http模块会自动跳转到res.on('end', function(){})
            //因为我们在res.on('end'， function(){})的回调函数中clearTimeout(responseTimer),
            //清除了这个定时器，所以就不用担心在接受到数据后定时器还反复执行。
            var responseTimer = setTimeout(function() {
                res.destroy();
                console.log('......Response Timeout......');
            }, 5000);

            var bufferHelper = new BufferHelper();
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('error', function(e) {
                console.log(e);
                reject(e);
            });
            res.on('end', function() {
                clearTimeout(responseTimer);
                var str = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                var $ = cheerio.load(str);
                var str = $('td.t_f[id^=postmessage]').eq(0).text();
                // console.log(str);
                resolve(str);
            });
        });
    });
    return p;
}





var main = async function(url) {
    var alist = [];
    try {
        let total_num = await getTotal(url);
         let k=0
        for (let i = 1; i < total_num; i++) {
            let urls = `http://www.xuancheng.org/forum-268-${i}.html`;
            let as = await getPre(urls);
            //发帖时间在半年以前的，退出搜集。
            let d1 = new Date(as[0].date);
            let now = Date.now();
            let day = parseInt((now - d1) / ONEDAY);
            if (day > 180)
                break;
            // 抓取每个帖子的body部分
           
            for (let j = 0; j < as.length; j++,k++) {
                let tempurl = as[j].href;
                while (as[j].body==null) {
                    let body = await getContent(tempurl);
                    as[j].body = body;
                }
                console.log(k);
            }


             await saveToDB(as);

        }
        console.log('ookk');
        //抓取每个帖子的body部分
        // for (let i = 0; i < as.length; i++) {
        //     let tempurl = as[i].href;
        //     let body = await getContent(tempurl);
        //     as[i].body = body;
        //     // await saveToDB(alist[i]);
        // }

    } catch (e) {
        console.log(e);
        reject(e);
    }
}

main(options.url);

// var d1=new Date('2017-5-12');
// var d2=Date.now();
// var d=(d2-d1)/(ONEDAY);
// console.log(parseInt(d))
// var str='\n来个猫猫一起玩好吗\n\n\n\n\n\n来自宣';
// console.log(str.replace(/\n/g,"<br>"));

//保存数据库
var saveToDB = function(alist) {
    var p = new Promise(function(resolve, reject) {
        try {
            OutAModel.insertMany(alist, function(error, docs) {
                if (error) reject(error);
                resolve('okk')
                // console.log(docs);
            });
        } catch (e) {
            reject(e);
        }

    });
    return p;
}

var save = async function() {
    try {
        var alist = require('./alist.json');
        //await saveToDB(alist);
    } catch (e) {
        console.log(e);
    }
}

// save();

// function timeend1() {
//     var p = new Promise(function(resolve, reject) {
//         setTimeout(()=>resolve('timeend1'), 3000);
//     });
//     return p;
// }

// function timeend2() {
//     var p = new Promise(function(resolve, reject) {
//         setTimeout(()=>reject(new Error('timeend2')), 2000);
//     });
//     return p;
// }
//  async function ttt() {
//     var flag = true;
//     while (flag) {
//         console.log('---');
//          await Promise.race([timeend1, timeend2]).then(function(rs) {
//             console.log(rs);

//         }).catch(function(e){
//             flag=false;
//         });
//     }
// }

// ttt();

// var schedule = require('node-schedule');

// var j = schedule.scheduleJob('5 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });