var express = require('express');
var router = express.Router();
var uService = require('../services/userService');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/login', function(req, res, next) {
    res.render('login');
});
router.post('/login', function(req, res, next) {

    var user = {
        name: req.body.name,
        passwd: req.body.passwd
    };
    var conditions = { name: user.name, passwd: user.passwd };
    uService.findOne(conditions).then(function(val) {
        if (val != null && val.length == 1) {
            v = val[0];
            req.session.user = {
                name: v.name,
                id: v._id,
                uname: v.uname || ''
            };

            // res.json({ success: 'ok' });
            res.redirect('/');
        } else {
            res.render('login',{message:"用户名或密码错误"});
        }
    });
});

router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/exists', function(req, res, next) {
    var name = req.query.name;
    uService.exists(name).then(function(val) {
        if (val != null) { res.json(false); } else { res.json(true); }
    }).catch(function(e) {
        res.json(false);
    });
});
router.get('/reg', function(req, res, next) {
    res.render('reg');
});
router.post('/reg', function(req, res, next) {

    var u = {
        name: req.body.name,
        passwd: req.body.passwd,
        lianxi: req.body.lianxi
    };
    uService.save(u).then(function(val) {
        req.session.user = u.name; //这里是user  在app.js 中有
        res.render('umainpage');
    }).catch(function(e) {
        res.redirect(req.path);
    });

})


router.get('/main', function(req, res, next) {
    var name = req.session.name;
    if (name == null)
        return res.redirect('/users/login');
    var msg = 'user name is ' + name;
    res.render('main', { msg: msg, name: name });
});
router.get('/umainpage', function(req, res, next) {



    res.render('umainpage');
});

router.post('/update', function(req, res, next) {
    var passwd = req.body.passwd;
    var newpasswd = req.body.newpasswd || '';
    if (newpasswd.trim().length <= 0){
        newpasswd = passwd;
    }
    var user = {
        id: req.session.user.id,
        uname: req.body.uname,
        lianxi: req.body.lianxi,
        newpasswd: req.body.newpasswd
    };
    (async function() {
        try {
            var conditions = { _id: user.id, passwd: passwd };
            let rs = await uService.findOne(conditions);
            if (rs.length == 0) {
                req.session.message = { update: '密码错误' };
                res.redirect('/u/umainpage');
            } else {
                var conditions = { _id: user.id };
                var set = {
                    uname: user.uname,
                    lianxi: user.lianxi,
                    passwd: newpasswd
                };
                let rs2 = await uService.update(conditions, set);
                console.log('修改用户成功');
                res.redirect('/u/umainpage');
            }
        } catch (e) {
            req.session.message = { update: '密码错误' };
            res.redirect('/u/umainpage');
        }

    }());
});


module.exports = router;