var express = require('express');
var router = express.Router();
var uService = require('../services/userService');

/* GET users listing. */
router.get('/u', function(req, res, next) {
    var user = req.session.user;

    var conditions={_id:user.id};
    (async function() {
            try {
                let u= await uService.findOne(conditions);
                console.log(u)
                console.log('----------------')
                res.render('umanager', { user: u[0]});              
            } catch (e) {
            	console.log(e);
            }
        }());

    
});

module.exports = router;