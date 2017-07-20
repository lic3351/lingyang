var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var Upfile = require('../services/uploadService');
var aService = require('../services/articleService');
var config = require('../config').config;
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('post');
});

router.get('/forum', function(req, res, next) {
    var limit = config.page.limit;
    (async function() {
        try {
            let docs = await aService.findAll(limit);
            res.render('forum', { list: docs, limit: limit });
        } catch (e) {

        }
    }());
});

router.post('/more', function(req, res, next) {
    var skip = req.body.skip;
    var limit = req.body.limit;
    (async function() {
        try {
            let docs = await aService.findAll(limit, skip);
            res.render('../views/mv-alist.ejs', { list: docs });

        } catch (e) {
            console.log('cuowu')
        }
    }());
})


router.post('/publish', upload.array('files', 6), function(req, res, next) {
    var files = req.files;
    var p = req.body;
    var article = {
        type: p.type,
        title: p.title,
        body: p.body,
        author_id: req.session.user.id,
        author_name: req.session.user.name,
        author_uname: req.session.user.uname
    };
    (async function() {
        try {
            let filelist = await Upfile.uploadfiles(req.files);
            article.images = filelist;
            // console.log(article);
            await aService.save(article);
            res.redirect('forum');
        } catch (e) {
            console.log('发布错误');
            res.redirect(req.path);
        }
    }());
});


router.get('/single/:id', function(req, res, next) {
    var id = req.params.id;
    (async function() {
        try {
            var conditions={_id:id};
            var update={ $inc: { viewcount: 1 }}
            let rs=await aService.update(conditions,update);
            let doc = await aService.findById(id);
            if (doc) {
                res.render('single', { article: doc[0] });
            }
        } catch (e) {
            console.log(e);
        }
    }());
});
router.get('/single/:id/:page',function(req,res,next){
    var id = req.params.id;
    var page=req.params.page;
    var num=5;
    (async function() {
        try {
            let doc = await aService.findById(id);
            if (doc) {
                var start=(page-1)*num;
                var end=start+num;
                let doc = await aService.findById(id);
                var list=doc[0].comments.slice(start,end);
                var meta={
                    page:page,
                    total:doc[0].comments.length,
                    num:num
                };
                res.render('mv-comments',{comments:list,meta:meta});
            }
        } catch (e) {
            console.log(e);
        }
    }());
})


router.post('/addc', function(req, res, next) {
    var aid = req.body.aid;
    var comment = {
        body: req.body.body,
        author_id: req.session.user.id,
        author_name: req.session.user.name,
        author_uname: req.session.user.uname
    };
    (async function() {
        try {
            var conditions={_id:aid};
            var update={ $push:{comments:comment}};
            let rs = await aService.update(conditions, update);
            res.send(aid);
        }catch(e){
            console.log(e);
        }
    }());

})
router.get('/manager', function(req, res, next) {
    var skip = req.body.skip || 0;
    var limit = req.body.limit || 6;
    var uid=req.session.user.id;
    var conditions={author_id:uid};
    (async function() {
        try {
            let docs = await aService.findAll(limit, skip,conditions);
            res.render('amanager', { list: docs });

        } catch (e) {
            console.log('cuowu')
        }
    }());  
});

router.get('/del/:aid', function(req, res, next) {
    var aid = req.params.aid;

    var conditions={_id:aid};
    (async function() {
        try {
            let rs = await aService.del(conditions);
            res.redirect('/u/umainpage');

        } catch (e) {
            console.log('cuowu')
        }
    }());  
});

router.get('/jie/:aid', function(req, res, next) {
    var aid = req.params.aid;

    var conditions={_id:aid};
    (async function() {
        try {
            var conditions={_id:aid};
            var update={ $set:{status:1}};
            let rs = await aService.update(conditions, update);
            res.redirect('/u/umainpage');
        } catch (e) {
            console.log('cuowu')
        }
    }());  
});

module.exports = router;