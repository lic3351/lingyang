var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

var svgCaptcha = require('svg-captcha');

//upload
var Upfile = require('../services/uploadService');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//

router.post('/upload', upload.array('files', 6), function(req, res, next) {
    var files = req.files;
    var n=req.body.name;
    console.log(n,files.length);

    Upfile.uploadfiles(req.files).then(function(val) {
        var rs={
            error:'',
            errorkeys:[]
        };
        if (val != null) {
            console.log('传输成功');
            rs.data=val;
            res.json(rs);
        } else {
            rs.error='上传发生错误';
            res.json(rs);
            console.log('上传发生错误');
        }
    }).catch(function(e) {
        console.log('catch 上传发生错误');
    });
});


router.get('/captcha', function(req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLowerCase();
    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

router.post('/yanzhen', function(req, res, next) {
    var text = req.body.yanzhen.toLowerCase();
    if (text == req.session.captcha) {
        res.send(true);
    } else {
        res.send(false);
    }
});



/* GET home page. */
router.get('/', function(req, res, next) {
    var city = req.body.city || '宣城';
    var options = {
        "url": 'http://www.weather.com.cn/weather1d/101221401.shtml',
        "Accept": 'text/html,application/xhtml+xml,application/xml;',
        "Accept-Encoding": 'gzip, deflate, br',
        "User - Agent": 'Mozilla/5.0(Windows NT 10.0; WOW64; rv:54.0)',
        "Connection": 'keep - alive'

    };
    try {
        // request(options, function(error, response, body) {

        //     if (!error && response.statusCode == 200) {
        //         $ = cheerio.load(body);
        //         var ccc = $("div#today div.t").html();
        //         res.send(ccc);
        //     }
        // })
    } catch (error) {
        console.log(error);
        return error;
    }


});


module.exports = router;